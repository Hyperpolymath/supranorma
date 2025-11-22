import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { CodeAnalyzer } from '@supranorma/ai-core';
import { createLLMFromEnv } from '../utils/llm-factory';
import { readCodeFile } from '../utils/file-utils';

export const explainCommand = new Command('explain')
  .description('Get an explanation of what code does')
  .argument('<file>', 'File to explain')
  .action(async (file: string) => {
    const spinner = ora('Analyzing code...').start();

    try {
      const llm = createLLMFromEnv();
      const analyzer = new CodeAnalyzer(llm);

      const { code, language } = await readCodeFile(file);
      const explanation = await analyzer.explainCode(code, language);

      spinner.succeed('Explanation generated');

      console.log('\n' + chalk.bold.blue('Code Explanation'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(explanation);
    } catch (error) {
      spinner.fail('Explanation failed');
      console.error(chalk.red('Error:'), (error as Error).message);
      process.exit(1);
    }
  });
