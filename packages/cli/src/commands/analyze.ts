import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { CodeAnalyzer } from '@supranorma/ai-core';
import { createLLMFromEnv } from '../utils/llm-factory';
import { readCodeFile } from '../utils/file-utils';

export const analyzeCommand = new Command('analyze')
  .description('Analyze code for quality, complexity, and issues')
  .argument('<file>', 'File to analyze')
  .option('-d, --detailed', 'Show detailed analysis')
  .action(async (file: string, options: { detailed?: boolean }) => {
    const spinner = ora('Analyzing code...').start();

    try {
      const llm = createLLMFromEnv();
      const analyzer = new CodeAnalyzer(llm);

      const { code, language } = await readCodeFile(file);
      const result = await analyzer.analyzeCode(code, language);

      spinner.succeed('Analysis complete');

      console.log('\n' + chalk.bold.blue('Code Analysis Results'));
      console.log(chalk.gray('─'.repeat(50)));

      console.log(chalk.bold('\nSummary:'));
      console.log(result.summary);

      console.log(chalk.bold('\nMetrics:'));
      console.log(`  Lines of Code: ${chalk.cyan(result.metrics.linesOfCode)}`);
      console.log(`  Cyclomatic Complexity: ${chalk.cyan(result.metrics.cyclomaticComplexity)}`);
      console.log(`  Maintainability Index: ${chalk.cyan(result.metrics.maintainabilityIndex)}`);
      console.log(`  Functions: ${chalk.cyan(result.metrics.functionsCount)}`);
      console.log(`  Classes: ${chalk.cyan(result.metrics.classesCount)}`);

      if (result.issues.length > 0) {
        console.log(chalk.bold('\nIssues:'));
        result.issues.forEach((issue, index) => {
          const color = issue.severity === 'error'
            ? chalk.red
            : issue.severity === 'warning'
            ? chalk.yellow
            : chalk.blue;

          console.log(`  ${index + 1}. ${color(issue.severity.toUpperCase())} - ${issue.message}`);
          if (issue.line) {
            console.log(`     ${chalk.gray(`Line ${issue.line}`)}`);
          }
        });
      }

      if (result.suggestions.length > 0) {
        console.log(chalk.bold('\nSuggestions:'));
        result.suggestions.forEach((suggestion, index) => {
          console.log(`  ${index + 1}. ${suggestion}`);
        });
      }

      if (options.detailed) {
        console.log(chalk.bold('\nDetailed Analysis:'));
        const refactoring = await analyzer.suggestRefactoring(code, language);
        console.log(refactoring);
      }
    } catch (error) {
      spinner.fail('Analysis failed');
      console.error(chalk.red('Error:'), (error as Error).message);
      process.exit(1);
    }
  });
