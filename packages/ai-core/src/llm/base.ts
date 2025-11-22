import { LLMConfig, ChatCompletionOptions, ChatCompletionResponse } from '../types';
import { ProcessingError } from '@supranorma/shared';

export abstract class BaseLLM {
  protected config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  abstract complete(options: ChatCompletionOptions): Promise<ChatCompletionResponse>;

  abstract stream(
    options: ChatCompletionOptions,
    onChunk: (chunk: string) => void
  ): Promise<ChatCompletionResponse>;

  protected handleError(error: unknown): never {
    if (error instanceof Error) {
      throw new ProcessingError(`LLM Error: ${error.message}`, {
        provider: this.config.provider,
        model: this.config.model,
      });
    }
    throw new ProcessingError('Unknown LLM error', {
      provider: this.config.provider,
    });
  }

  countTokens(text: string): number {
    // Simple approximation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }
}
