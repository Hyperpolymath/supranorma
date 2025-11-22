import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { writeFile } from 'fs/promises';
import inquirer from 'inquirer';
import { CodeAnalyzer } from '@supranorma/ai-core';
import { createLLMFromEnv } from '../utils/llm-factory';
import { readCodeFile } from '../utils/file-utils';

export const refactorCommand = new Command('refactor')
  .description('Get refactoring suggestions for code')
  .argument('<file>', 'File to refactor')
  .option('-a, --apply', 'Apply suggestions (preview first)')
  .action(async (file: string, options: { apply?: boolean }) => {
    const spinner = ora('Analyzing code for refactoring...').start();

    try {
      const llm = createLLMFromEnv();
      const analyzer = new CodeAnalyzer(llm);

      const { code, language } = await readCodeFile(file);
      const suggestions = await analyzer.suggestRefactoring(code, language);

      spinner.succeed('Refactoring suggestions generated');

      console.log('\n' + chalk.bold.blue('Refactoring Suggestions'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(suggestions);

      if (options.apply) {
        const { confirm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: 'Apply refactoring suggestions?',
            default: false,
          },
        ]);

        if (confirm) {
          await writeFile(file, suggestions, 'utf-8');
          console.log(chalk.green(`✓ Refactored code saved to ${file}`));
        }
      }
    } catch (error) {
      spinner.fail('Refactoring failed');
      console.error(chalk.red('Error:'), (error as Error).message);
      process.exit(1);
    }
  });
