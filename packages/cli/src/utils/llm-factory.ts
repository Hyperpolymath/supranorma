import { createLLM, BaseLLM } from '@supranorma/ai-core';
import { LLMConfig } from '@supranorma/ai-core';
import { ConfigurationError } from '@supranorma/shared';

export function createLLMFromEnv(): BaseLLM {
  const provider = (process.env.SUPRANORMA_LLM_PROVIDER || 'anthropic') as 'anthropic' | 'openai';
  const apiKey = provider === 'anthropic'
    ? process.env.ANTHROPIC_API_KEY
    : process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new ConfigurationError(
      `API key not found. Please set ${provider === 'anthropic' ? 'ANTHROPIC_API_KEY' : 'OPENAI_API_KEY'} environment variable.`
    );
  }

  const config: LLMConfig = {
    provider,
    apiKey,
    model: process.env.SUPRANORMA_LLM_MODEL,
    maxTokens: process.env.SUPRANORMA_LLM_MAX_TOKENS
      ? parseInt(process.env.SUPRANORMA_LLM_MAX_TOKENS, 10)
      : undefined,
    temperature: process.env.SUPRANORMA_LLM_TEMPERATURE
      ? parseFloat(process.env.SUPRANORMA_LLM_TEMPERATURE)
      : undefined,
  };

  return createLLM(config);
}
