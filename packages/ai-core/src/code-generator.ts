import { BaseLLM } from './llm';
import { CodeGenerationOptions, CodeGenerationResult } from './types';
import { createLogger } from '@supranorma/shared';

const logger = createLogger({ prefix: 'code-generator' });

export class CodeGenerator {
  constructor(private llm: BaseLLM) {}

  async generateCode(options: CodeGenerationOptions): Promise<CodeGenerationResult> {
    logger.info(`Generating ${options.language} code...`);

    const systemPrompt = this.buildSystemPrompt(options);
    const userPrompt = this.buildUserPrompt(options);

    const response = await this.llm.complete({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.6,
    });

    return this.parseResponse(response.content, options);
  }

  private buildSystemPrompt(options: CodeGenerationOptions): string {
    let prompt = `You are an expert ${options.language} developer. Generate clean, well-structured, and efficient code.`;

    if (options.includeComments) {
      prompt += ' Include helpful comments explaining the code.';
    }

    if (options.includeTests) {
      prompt += ' Also generate comprehensive unit tests.';
    }

    prompt += '\n\nFormat your response as JSON with the following structure:';
    prompt += '\n{';
    prompt += '\n  "code": "the generated code",';
    prompt += '\n  "explanation": "brief explanation of the implementation"';

    if (options.includeTests) {
      prompt += ',\n  "tests": "the test code"';
    }

    prompt += '\n}';

    return prompt;
  }

  private buildUserPrompt(options: CodeGenerationOptions): string {
    let prompt = `Generate ${options.language} code for the following:\n\n${options.description}`;

    if (options.context) {
      prompt += `\n\nAdditional context:\n${options.context}`;
    }

    return prompt;
  }

  private parseResponse(content: string, options: CodeGenerationOptions): CodeGenerationResult {
    try {
      const parsed = JSON.parse(content);
      return {
        code: parsed.code || '',
        explanation: parsed.explanation || '',
        tests: options.includeTests ? parsed.tests : undefined,
      };
    } catch {
      // Fallback if response is not JSON
      const codeMatch = content.match(/```[\w]*\n([\s\S]*?)\n```/);
      const code = codeMatch ? codeMatch[1] : content;

      return {
        code,
        explanation: 'Code generated successfully',
        tests: undefined,
      };
    }
  }

  async improveCode(code: string, language: string, instruction: string): Promise<string> {
    logger.info('Improving code based on instruction...');

    const response = await this.llm.complete({
      messages: [
        {
          role: 'system',
          content: `You are an expert ${language} developer. Improve the code according to the given instruction. Return only the improved code.`,
        },
        {
          role: 'user',
          content: `Current code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nInstruction: ${instruction}`,
        },
      ],
      temperature: 0.5,
    });

    const codeMatch = response.content.match(/```[\w]*\n([\s\S]*?)\n```/);
    return codeMatch ? codeMatch[1] : response.content;
  }

  async generateTests(code: string, language: string, framework?: string): Promise<string> {
    logger.info('Generating tests...');

    const testFramework = framework || this.getDefaultTestFramework(language);

    const response = await this.llm.complete({
      messages: [
        {
          role: 'system',
          content: `You are an expert at writing tests in ${language} using ${testFramework}. Generate comprehensive unit tests.`,
        },
        {
          role: 'user',
          content: `Generate tests for this code:\n\`\`\`${language}\n${code}\n\`\`\``,
        },
      ],
      temperature: 0.4,
    });

    const codeMatch = response.content.match(/```[\w]*\n([\s\S]*?)\n```/);
    return codeMatch ? codeMatch[1] : response.content;
  }

  private getDefaultTestFramework(language: string): string {
    const frameworks: Record<string, string> = {
      javascript: 'Jest',
      typescript: 'Vitest',
      python: 'pytest',
      java: 'JUnit',
      go: 'testing',
      rust: 'cargo test',
    };

    return frameworks[language.toLowerCase()] || 'the standard testing framework';
  }

  async fixCode(code: string, language: string, error: string): Promise<string> {
    logger.info('Fixing code error...');

    const response = await this.llm.complete({
      messages: [
        {
          role: 'system',
          content: `You are an expert ${language} developer. Fix the error in the code and return only the corrected code.`,
        },
        {
          role: 'user',
          content: `Code with error:\n\`\`\`${language}\n${code}\n\`\`\`\n\nError: ${error}`,
        },
      ],
      temperature: 0.3,
    });

    const codeMatch = response.content.match(/```[\w]*\n([\s\S]*?)\n```/);
    return codeMatch ? codeMatch[1] : response.content;
  }
}
