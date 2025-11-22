import OpenAI from 'openai';
import { BaseLLM } from './base';
import { ChatCompletionOptions, ChatCompletionResponse, LLMConfig } from '../types';

export class OpenAILLM extends BaseLLM {
  private client: OpenAI;

  constructor(config: LLMConfig) {
    super(config);
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });
  }

  async complete(options: ChatCompletionOptions): Promise<ChatCompletionResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.config.model || 'gpt-4-turbo-preview',
        max_tokens: options.maxTokens || this.config.maxTokens || 4096,
        temperature: options.temperature ?? this.config.temperature ?? 0.7,
        messages: options.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const choice = response.choices[0];

      return {
        content: choice.message.content || '',
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
        model: response.model,
        finishReason: choice.finish_reason || 'stop',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async stream(
    options: ChatCompletionOptions,
    onChunk: (chunk: string) => void
  ): Promise<ChatCompletionResponse> {
    try {
      const stream = await this.client.chat.completions.create({
        model: this.config.model || 'gpt-4-turbo-preview',
        max_tokens: options.maxTokens || this.config.maxTokens || 4096,
        temperature: options.temperature ?? this.config.temperature ?? 0.7,
        messages: options.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        stream: true,
      });

      let fullContent = '';
      let model = '';
      let finishReason = '';

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta;
        if (delta?.content) {
          fullContent += delta.content;
          onChunk(delta.content);
        }
        if (chunk.choices[0]?.finish_reason) {
          finishReason = chunk.choices[0].finish_reason;
        }
        if (chunk.model) {
          model = chunk.model;
        }
      }

      return {
        content: fullContent,
        usage: {
          promptTokens: this.countTokens(options.messages.map((m) => m.content).join('')),
          completionTokens: this.countTokens(fullContent),
          totalTokens: 0,
        },
        model,
        finishReason,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
