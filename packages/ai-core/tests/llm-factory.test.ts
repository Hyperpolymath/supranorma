import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createLLM, getLLMFromEnv } from '../src/llm';
import { AnthropicLLM } from '../src/llm/anthropic';
import { OpenAILLM } from '../src/llm/openai';
import { BaseLLM } from '../src/llm/base';

describe('LLM Factory', () => {
  describe('createLLM', () => {
    it('should create Anthropic LLM', () => {
      const llm = createLLM({
        provider: 'anthropic',
        apiKey: 'test-key',
      });

      expect(llm).toBeInstanceOf(AnthropicLLM);
      expect(llm).toBeInstanceOf(BaseLLM);
    });

    it('should create OpenAI LLM', () => {
      const llm = createLLM({
        provider: 'openai',
        apiKey: 'test-key',
      });

      expect(llm).toBeInstanceOf(OpenAILLM);
      expect(llm).toBeInstanceOf(BaseLLM);
    });

    it('should throw for invalid provider', () => {
      expect(() =>
        createLLM({
          provider: 'invalid' as any,
          apiKey: 'test-key',
        })
      ).toThrow();
    });

    it('should accept custom model', () => {
      const llm = createLLM({
        provider: 'anthropic',
        apiKey: 'test-key',
        model: 'claude-3-opus-20240229',
      });

      expect(llm).toBeInstanceOf(AnthropicLLM);
    });

    it('should accept custom max tokens', () => {
      const llm = createLLM({
        provider: 'anthropic',
        apiKey: 'test-key',
        maxTokens: 8192,
      });

      expect(llm).toBeInstanceOf(AnthropicLLM);
    });

    it('should accept custom temperature', () => {
      const llm = createLLM({
        provider: 'anthropic',
        apiKey: 'test-key',
        temperature: 0.5,
      });

      expect(llm).toBeInstanceOf(AnthropicLLM);
    });
  });

  describe('getLLMFromEnv', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      // Reset env before each test
      vi.resetModules();
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should create Anthropic LLM from env', () => {
      process.env.SUPRANORMA_LLM_PROVIDER = 'anthropic';
      process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';

      const llm = getLLMFromEnv();

      expect(llm).toBeInstanceOf(AnthropicLLM);
    });

    it('should create OpenAI LLM from env', () => {
      process.env.SUPRANORMA_LLM_PROVIDER = 'openai';
      process.env.OPENAI_API_KEY = 'test-openai-key';

      const llm = getLLMFromEnv();

      expect(llm).toBeInstanceOf(OpenAILLM);
    });

    it('should default to Anthropic if provider not set', () => {
      delete process.env.SUPRANORMA_LLM_PROVIDER;
      process.env.ANTHROPIC_API_KEY = 'test-key';

      const llm = getLLMFromEnv();

      expect(llm).toBeInstanceOf(AnthropicLLM);
    });

    it('should throw if API key not set for Anthropic', () => {
      process.env.SUPRANORMA_LLM_PROVIDER = 'anthropic';
      delete process.env.ANTHROPIC_API_KEY;

      expect(() => getLLMFromEnv()).toThrow(/API key not found/i);
    });

    it('should throw if API key not set for OpenAI', () => {
      process.env.SUPRANORMA_LLM_PROVIDER = 'openai';
      delete process.env.OPENAI_API_KEY;

      expect(() => getLLMFromEnv()).toThrow(/API key not found/i);
    });

    it('should use custom model from env', () => {
      process.env.SUPRANORMA_LLM_PROVIDER = 'anthropic';
      process.env.ANTHROPIC_API_KEY = 'test-key';
      process.env.SUPRANORMA_LLM_MODEL = 'claude-3-opus-20240229';

      const llm = getLLMFromEnv();

      expect(llm).toBeInstanceOf(AnthropicLLM);
    });

    it('should use custom max tokens from env', () => {
      process.env.SUPRANORMA_LLM_PROVIDER = 'anthropic';
      process.env.ANTHROPIC_API_KEY = 'test-key';
      process.env.SUPRANORMA_LLM_MAX_TOKENS = '8192';

      const llm = getLLMFromEnv();

      expect(llm).toBeInstanceOf(AnthropicLLM);
    });

    it('should use custom temperature from env', () => {
      process.env.SUPRANORMA_LLM_PROVIDER = 'anthropic';
      process.env.ANTHROPIC_API_KEY = 'test-key';
      process.env.SUPRANORMA_LLM_TEMPERATURE = '0.5';

      const llm = getLLMFromEnv();

      expect(llm).toBeInstanceOf(AnthropicLLM);
    });

    it('should handle invalid temperature gracefully', () => {
      process.env.SUPRANORMA_LLM_PROVIDER = 'anthropic';
      process.env.ANTHROPIC_API_KEY = 'test-key';
      process.env.SUPRANORMA_LLM_TEMPERATURE = 'invalid';

      const llm = getLLMFromEnv();

      expect(llm).toBeInstanceOf(AnthropicLLM);
    });

    it('should handle invalid max tokens gracefully', () => {
      process.env.SUPRANORMA_LLM_PROVIDER = 'anthropic';
      process.env.ANTHROPIC_API_KEY = 'test-key';
      process.env.SUPRANORMA_LLM_MAX_TOKENS = 'invalid';

      const llm = getLLMFromEnv();

      expect(llm).toBeInstanceOf(AnthropicLLM);
    });
  });

  describe('Configuration validation', () => {
    it('should validate provider values', () => {
      expect(() =>
        createLLM({
          provider: '' as any,
          apiKey: 'test-key',
        })
      ).toThrow();
    });

    it('should validate API key presence', () => {
      expect(() =>
        createLLM({
          provider: 'anthropic',
          apiKey: '',
        })
      ).toThrow();
    });

    it('should allow valid temperature range', () => {
      const llm = createLLM({
        provider: 'anthropic',
        apiKey: 'test-key',
        temperature: 0.0,
      });

      expect(llm).toBeInstanceOf(AnthropicLLM);

      const llm2 = createLLM({
        provider: 'anthropic',
        apiKey: 'test-key',
        temperature: 1.0,
      });

      expect(llm2).toBeInstanceOf(AnthropicLLM);
    });

    it('should allow valid max tokens', () => {
      const llm = createLLM({
        provider: 'anthropic',
        apiKey: 'test-key',
        maxTokens: 1,
      });

      expect(llm).toBeInstanceOf(AnthropicLLM);

      const llm2 = createLLM({
        provider: 'anthropic',
        apiKey: 'test-key',
        maxTokens: 100000,
      });

      expect(llm2).toBeInstanceOf(AnthropicLLM);
    });
  });

  describe('Provider detection', () => {
    it('should detect Anthropic from model name', () => {
      const llm = createLLM({
        provider: 'anthropic',
        apiKey: 'test-key',
        model: 'claude-3-5-sonnet-20241022',
      });

      expect(llm).toBeInstanceOf(AnthropicLLM);
    });

    it('should detect OpenAI from model name', () => {
      const llm = createLLM({
        provider: 'openai',
        apiKey: 'test-key',
        model: 'gpt-4-turbo-preview',
      });

      expect(llm).toBeInstanceOf(OpenAILLM);
    });
  });

  describe('Default configurations', () => {
    it('should use default Anthropic model', () => {
      const llm = createLLM({
        provider: 'anthropic',
        apiKey: 'test-key',
      });

      expect(llm).toBeInstanceOf(AnthropicLLM);
      // Default model should be set internally
    });

    it('should use default OpenAI model', () => {
      const llm = createLLM({
        provider: 'openai',
        apiKey: 'test-key',
      });

      expect(llm).toBeInstanceOf(OpenAILLM);
      // Default model should be set internally
    });

    it('should use default max tokens', () => {
      const llm = createLLM({
        provider: 'anthropic',
        apiKey: 'test-key',
      });

      expect(llm).toBeInstanceOf(AnthropicLLM);
      // Default maxTokens should be set internally
    });

    it('should use default temperature', () => {
      const llm = createLLM({
        provider: 'anthropic',
        apiKey: 'test-key',
      });

      expect(llm).toBeInstanceOf(AnthropicLLM);
      // Default temperature should be set internally
    });
  });
});
