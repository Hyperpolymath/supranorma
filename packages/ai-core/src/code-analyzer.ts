import { BaseLLM } from './llm';
import { CodeAnalysisResult, CodeIssue, CodeMetrics } from './types';
import { createLogger } from '@supranorma/shared';

const logger = createLogger({ prefix: 'code-analyzer' });

export class CodeAnalyzer {
  constructor(private llm: BaseLLM) {}

  async analyzeCode(code: string, language: string): Promise<CodeAnalysisResult> {
    logger.info(`Analyzing ${language} code...`);

    const [aiAnalysis, metrics] = await Promise.all([
      this.getAIAnalysis(code, language),
      this.calculateMetrics(code),
    ]);

    return {
      summary: aiAnalysis.summary,
      complexity: metrics.cyclomaticComplexity,
      issues: aiAnalysis.issues,
      suggestions: aiAnalysis.suggestions,
      metrics,
    };
  }

  private async getAIAnalysis(
    code: string,
    language: string
  ): Promise<{ summary: string; issues: CodeIssue[]; suggestions: string[] }> {
    const response = await this.llm.complete({
      messages: [
        {
          role: 'system',
          content: `You are an expert code reviewer. Analyze the provided ${language} code and provide:
1. A brief summary of what the code does
2. Any issues or potential problems (with severity: error, warning, or info)
3. Suggestions for improvement

Format your response as JSON with the following structure:
{
  "summary": "string",
  "issues": [{"severity": "error|warning|info", "message": "string", "line": number, "type": "string"}],
  "suggestions": ["string"]
}`,
        },
        {
          role: 'user',
          content: `Analyze this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
        },
      ],
      temperature: 0.3,
    });

    try {
      return JSON.parse(response.content);
    } catch {
      return {
        summary: response.content,
        issues: [],
        suggestions: [],
      };
    }
  }

  private calculateMetrics(code: string): CodeMetrics {
    const lines = code.split('\n');
    const linesOfCode = lines.filter((line) => line.trim() && !line.trim().startsWith('//')).length;

    // Simple heuristic for cyclomatic complexity
    const complexityKeywords = [
      'if',
      'else',
      'for',
      'while',
      'case',
      '&&',
      '||',
      '?',
      'catch',
    ];
    let complexity = 1;
    for (const keyword of complexityKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      const matches = code.match(regex);
      if (matches) {
        complexity += matches.length;
      }
    }

    const functionsCount = (code.match(/function\s+\w+|=>\s*{|:\s*\([^)]*\)\s*=>/g) || []).length;
    const classesCount = (code.match(/class\s+\w+/g) || []).length;

    // Simple maintainability index calculation
    const maintainabilityIndex = Math.max(
      0,
      Math.min(100, 171 - 5.2 * Math.log(linesOfCode) - 0.23 * complexity - 16.2 * Math.log(linesOfCode / (functionsCount || 1)))
    );

    return {
      linesOfCode,
      cyclomaticComplexity: complexity,
      maintainabilityIndex: Math.round(maintainabilityIndex),
      functionsCount,
      classesCount,
    };
  }

  async suggestRefactoring(code: string, language: string): Promise<string> {
    logger.info('Generating refactoring suggestions...');

    const response = await this.llm.complete({
      messages: [
        {
          role: 'system',
          content: `You are an expert code refactoring assistant. Suggest improvements to make the code more maintainable, readable, and efficient.`,
        },
        {
          role: 'user',
          content: `Suggest refactorings for this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
        },
      ],
      temperature: 0.4,
    });

    return response.content;
  }

  async explainCode(code: string, language: string): Promise<string> {
    logger.info('Generating code explanation...');

    const response = await this.llm.complete({
      messages: [
        {
          role: 'system',
          content: `You are an expert programming teacher. Explain the code in clear, simple terms.`,
        },
        {
          role: 'user',
          content: `Explain this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
        },
      ],
      temperature: 0.5,
    });

    return response.content;
  }
}
