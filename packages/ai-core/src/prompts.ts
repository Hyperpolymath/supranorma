export interface PromptTemplate {
  template: string;
  variables: string[];
}

export class PromptBuilder {
  private template: string;
  private variables: Map<string, string> = new Map();

  constructor(template: string) {
    this.template = template;
  }

  setVariable(name: string, value: string): this {
    this.variables.set(name, value);
    return this;
  }

  setVariables(vars: Record<string, string>): this {
    Object.entries(vars).forEach(([name, value]) => {
      this.variables.set(name, value);
    });
    return this;
  }

  build(): string {
    let result = this.template;

    this.variables.forEach((value, name) => {
      const regex = new RegExp(`{{\\s*${name}\\s*}}`, 'g');
      result = result.replace(regex, value);
    });

    // Check for unresolved variables
    const unresolvedVars = result.match(/{{[^}]+}}/g);
    if (unresolvedVars) {
      console.warn('Unresolved template variables:', unresolvedVars);
    }

    return result;
  }

  static create(template: string): PromptBuilder {
    return new PromptBuilder(template);
  }
}

export const CommonPrompts = {
  codeReview: `Review the following {{language}} code and provide feedback on:
1. Code quality and best practices
2. Potential bugs or issues
3. Performance optimizations
4. Security concerns

Code:
\`\`\`{{language}}
{{code}}
\`\`\``,

  codeExplanation: `Explain the following {{language}} code in simple terms:

\`\`\`{{language}}
{{code}}
\`\`\`

Explain:
1. What the code does
2. How it works
3. Key concepts used`,

  bugFix: `The following {{language}} code has an error:

\`\`\`{{language}}
{{code}}
\`\`\`

Error message:
{{error}}

Please:
1. Identify the root cause
2. Provide the fixed code
3. Explain the fix`,

  testGeneration: `Generate comprehensive unit tests for the following {{language}} code using {{framework}}:

\`\`\`{{language}}
{{code}}
\`\`\`

Include:
1. Test cases for normal behavior
2. Edge cases
3. Error handling`,

  refactoring: `Refactor the following {{language}} code to improve:
1. Readability
2. Maintainability
3. Performance
4. Following best practices

Original code:
\`\`\`{{language}}
{{code}}
\`\`\``,

  documentation: `Generate comprehensive documentation for the following {{language}} code:

\`\`\`{{language}}
{{code}}
\`\`\`

Include:
1. Overview of functionality
2. Parameter descriptions
3. Return value details
4. Usage examples
5. Notes and warnings if applicable`,
};
