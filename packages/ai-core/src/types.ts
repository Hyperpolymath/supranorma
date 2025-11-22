export interface LLMConfig {
  provider: 'anthropic' | 'openai';
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionOptions {
  messages: Message[];
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  finishReason: string;
}

export interface CodeAnalysisResult {
  summary: string;
  complexity: number;
  issues: CodeIssue[];
  suggestions: string[];
  metrics: CodeMetrics;
}

export interface CodeIssue {
  severity: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
  column?: number;
  type: string;
}

export interface CodeMetrics {
  linesOfCode: number;
  cyclomaticComplexity: number;
  maintainabilityIndex: number;
  functionsCount: number;
  classesCount: number;
}

export interface CodeGenerationOptions {
  language: string;
  description: string;
  context?: string;
  includeTests?: boolean;
  includeComments?: boolean;
}

export interface CodeGenerationResult {
  code: string;
  explanation: string;
  tests?: string;
}

export interface EmbeddingOptions {
  model?: string;
  dimensions?: number;
}

export interface EmbeddingResult {
  embedding: number[];
  model: string;
}

export interface SemanticSearchResult {
  content: string;
  similarity: number;
  metadata?: Record<string, any>;
}
