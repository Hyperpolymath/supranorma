import { Router } from 'express';
import { z } from 'zod';
import { createLLM, CodeAnalyzer, CodeGenerator } from '@supranorma/ai-core';
import { authenticate, AuthRequest } from '../middleware/auth';
import { ConfigurationError } from '@supranorma/shared';

export const aiRouter = Router();

aiRouter.use(authenticate);

const analyzeCodeSchema = z.object({
  code: z.string(),
  language: z.string(),
});

const generateCodeSchema = z.object({
  description: z.string(),
  language: z.string(),
  includeTests: z.boolean().optional(),
  includeComments: z.boolean().optional(),
});

const chatSchema = z.object({
  message: z.string(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
  })).optional(),
});

function getLLM() {
  const provider = (process.env.SUPRANORMA_LLM_PROVIDER || 'anthropic') as 'anthropic' | 'openai';
  const apiKey = provider === 'anthropic'
    ? process.env.ANTHROPIC_API_KEY
    : process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new ConfigurationError('AI provider API key not configured');
  }

  return createLLM({
    provider,
    apiKey,
    model: process.env.SUPRANORMA_LLM_MODEL,
  });
}

aiRouter.post('/analyze', async (req: AuthRequest, res, next) => {
  try {
    const data = analyzeCodeSchema.parse(req.body);

    const llm = getLLM();
    const analyzer = new CodeAnalyzer(llm);

    const result = await analyzer.analyzeCode(data.code, data.language);

    res.json({ analysis: result });
  } catch (error) {
    next(error);
  }
});

aiRouter.post('/generate', async (req: AuthRequest, res, next) => {
  try {
    const data = generateCodeSchema.parse(req.body);

    const llm = getLLM();
    const generator = new CodeGenerator(llm);

    const result = await generator.generateCode({
      language: data.language,
      description: data.description,
      includeTests: data.includeTests,
      includeComments: data.includeComments,
    });

    res.json({ generation: result });
  } catch (error) {
    next(error);
  }
});

aiRouter.post('/chat', async (req: AuthRequest, res, next) => {
  try {
    const data = chatSchema.parse(req.body);

    const llm = getLLM();

    const messages = [
      ...(data.history || []),
      { role: 'user' as const, content: data.message },
    ];

    const response = await llm.complete({ messages });

    res.json({
      message: response.content,
      usage: response.usage,
    });
  } catch (error) {
    next(error);
  }
});
