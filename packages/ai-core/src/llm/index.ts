import { LLMConfig } from '../types';
import { BaseLLM } from './base';
import { AnthropicLLM } from './anthropic';
import { OpenAILLM } from './openai';
import { ConfigurationError } from '@supranorma/shared';

export * from './base';
export * from './anthropic';
export * from './openai';

export function createLLM(config: LLMConfig): BaseLLM {
  switch (config.provider) {
    case 'anthropic':
      return new AnthropicLLM(config);
    case 'openai':
      return new OpenAILLM(config);
    default:
      throw new ConfigurationError(`Unsupported LLM provider: ${config.provider}`);
  }
}
