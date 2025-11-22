import Anthropic from '@anthropic-ai/sdk';
import { BaseLLM } from './base';
import { ChatCompletionOptions, ChatCompletionResponse, LLMConfig } from '../types';

export class AnthropicLLM extends BaseLLM {
  private client: Anthropic;

  constructor(config: LLMConfig) {
    super(config);
    this.client = new Anthropic({
      apiKey: config.apiKey,
    });
  }

  async complete(options: ChatCompletionOptions): Promise<ChatCompletionResponse> {
    try {
      const systemMessage = options.messages.find((m) => m.role === 'system');
      const userMessages = options.messages.filter((m) => m.role !== 'system');

      const response = await this.client.messages.create({
        model: this.config.model || 'claude-3-5-sonnet-20241022',
        max_tokens: options.maxTokens || this.config.maxTokens || 4096,
        temperature: options.temperature ?? this.config.temperature ?? 0.7,
        system: systemMessage?.content,
        messages: userMessages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      });

      const content = response.content[0];
      const text = content.type === 'text' ? content.text : '';

      return {
        content: text,
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens,
        },
        model: response.model,
        finishReason: response.stop_reason || 'stop',
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
      const systemMessage = options.messages.find((m) => m.role === 'system');
      const userMessages = options.messages.filter((m) => m.role !== 'system');

      let fullContent = '';
      let inputTokens = 0;
      let outputTokens = 0;
      let model = '';
      let finishReason = '';

      const stream = await this.client.messages.create({
        model: this.config.model || 'claude-3-5-sonnet-20241022',
        max_tokens: options.maxTokens || this.config.maxTokens || 4096,
        temperature: options.temperature ?? this.config.temperature ?? 0.7,
        system: systemMessage?.content,
        messages: userMessages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        stream: true,
      });

      for await (const event of stream) {
        if (event.type === 'content_block_delta') {
          if (event.delta.type === 'text_delta') {
            const chunk = event.delta.text;
            fullContent += chunk;
            onChunk(chunk);
          }
        } else if (event.type === 'message_start') {
          model = event.message.model;
          inputTokens = event.message.usage.input_tokens;
        } else if (event.type === 'message_delta') {
          outputTokens = event.usage.output_tokens;
          finishReason = event.delta.stop_reason || 'stop';
        }
      }

      return {
        content: fullContent,
        usage: {
          promptTokens: inputTokens,
          completionTokens: outputTokens,
          totalTokens: inputTokens + outputTokens,
        },
        model,
        finishReason,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
