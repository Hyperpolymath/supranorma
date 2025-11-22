import { readFile } from 'fs/promises';
import { join } from 'path';
import { globby } from 'globby';
import { QualityCheckResult, QualityIssue } from '../types';
import { createLogger } from '@supranorma/shared';

const logger = createLogger({ prefix: 'quality' });

export class CodeQualityChecker {
  private rules: QualityRule[] = [];

  constructor() {
    this.registerDefaultRules();
  }

  registerRule(rule: QualityRule): void {
    this.rules.push(rule);
  }

  private registerDefaultRules(): void {
    this.registerRule(new NoConsoleLogRule());
    this.registerRule(new NoTodoCommentsRule());
    this.registerRule(new FileNamingConventionRule());
    this.registerRule(new MaxLineLengthRule());
    this.registerRule(new NoDebuggerRule());
  }

  async check(directory: string, pattern = '**/*.{ts,tsx,js,jsx}'): Promise<QualityCheckResult> {
    logger.info(`Checking code quality in: ${directory}`);

    const files = await globby(pattern, {
      cwd: directory,
      absolute: true,
      gitignore: true,
    });

    const issues: QualityIssue[] = [];

    for (const file of files) {
      const content = await readFile(file, 'utf-8');
      const fileIssues = await this.checkFile(file, content);
      issues.push(...fileIssues);
    }

    const errors = issues.filter((i) => i.severity === 'error');
    const warnings = issues.filter((i) => i.severity === 'warning');
    const info = issues.filter((i) => i.severity === 'info');

    const score = this.calculateScore(errors.length, warnings.length, info.length);

    logger.info(`Quality check complete: ${files.length} files checked`);
    logger.info(`Issues: ${errors.length} errors, ${warnings.length} warnings, ${info.length} info`);
    logger.info(`Quality score: ${score}/100`);

    return {
      passed: errors.length === 0,
      errors,
      warnings,
      info,
      score,
    };
  }

  private async checkFile(filePath: string, content: string): Promise<QualityIssue[]> {
    const issues: QualityIssue[] = [];

    for (const rule of this.rules) {
      const ruleIssues = await rule.check(filePath, content);
      issues.push(...ruleIssues);
    }

    return issues;
  }

  private calculateScore(errors: number, warnings: number, info: number): number {
    const errorPenalty = errors * 10;
    const warningPenalty = warnings * 5;
    const infoPenalty = info * 1;

    const score = Math.max(0, 100 - errorPenalty - warningPenalty - infoPenalty);
    return Math.round(score);
  }
}

export interface QualityRule {
  name: string;
  check(filePath: string, content: string): Promise<QualityIssue[]>;
}

class NoConsoleLogRule implements QualityRule {
  name = 'no-console-log';

  async check(filePath: string, content: string): Promise<QualityIssue[]> {
    const issues: QualityIssue[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('console.log')) {
        issues.push({
          severity: 'warning',
          message: 'Avoid using console.log in production code',
          file: filePath,
          line: index + 1,
          rule: this.name,
        });
      }
    });

    return issues;
  }
}

class NoTodoCommentsRule implements QualityRule {
  name = 'no-todo-comments';

  async check(filePath: string, content: string): Promise<QualityIssue[]> {
    const issues: QualityIssue[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (/\/\/\s*TODO|\/\*\s*TODO/.test(line)) {
        issues.push({
          severity: 'info',
          message: 'TODO comment found',
          file: filePath,
          line: index + 1,
          rule: this.name,
        });
      }
    });

    return issues;
  }
}

class FileNamingConventionRule implements QualityRule {
  name = 'file-naming-convention';

  async check(filePath: string): Promise<QualityIssue[]> {
    const issues: QualityIssue[] = [];
    const fileName = filePath.split('/').pop() || '';

    // Check for kebab-case or PascalCase
    if (!/^[a-z0-9-]+\.[a-z]+$/.test(fileName) && !/^[A-Z][a-zA-Z0-9]+\.[a-z]+$/.test(fileName)) {
      issues.push({
        severity: 'warning',
        message: 'File should use kebab-case or PascalCase naming',
        file: filePath,
        rule: this.name,
      });
    }

    return issues;
  }
}

class MaxLineLengthRule implements QualityRule {
  name = 'max-line-length';
  maxLength = 120;

  async check(filePath: string, content: string): Promise<QualityIssue[]> {
    const issues: QualityIssue[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.length > this.maxLength) {
        issues.push({
          severity: 'info',
          message: `Line exceeds maximum length of ${this.maxLength} characters`,
          file: filePath,
          line: index + 1,
          rule: this.name,
        });
      }
    });

    return issues;
  }
}

class NoDebuggerRule implements QualityRule {
  name = 'no-debugger';

  async check(filePath: string, content: string): Promise<QualityIssue[]> {
    const issues: QualityIssue[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('debugger')) {
        issues.push({
          severity: 'error',
          message: 'Debugger statement should not be in production code',
          file: filePath,
          line: index + 1,
          rule: this.name,
        });
      }
    });

    return issues;
  }
}

export function createQualityChecker(): CodeQualityChecker {
  return new CodeQualityChecker();
}
