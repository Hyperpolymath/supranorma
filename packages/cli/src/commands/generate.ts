import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { writeFile } from 'fs/promises';
import inquirer from 'inquirer';
import { CodeGenerator } from '@supranorma/ai-core';
import { createLLMFromEnv } from '../utils/llm-factory';

export const generateCommand = new Command('generate')
  .description('Generate code from a description')
  .option('-l, --language <language>', 'Programming language')
  .option('-o, --output <file>', 'Output file')
  .option('-t, --tests', 'Include tests')
  .option('-c, --comments', 'Include comments')
  .action(async (options: {
    language?: string;
    output?: string;
    tests?: boolean;
    comments?: boolean;
  }) => {
    try {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'language',
          message: 'Programming language:',
          default: 'typescript',
          when: !options.language,
        },
        {
          type: 'editor',
          name: 'description',
          message: 'Describe what code you want to generate:',
        },
        {
          type: 'input',
          name: 'output',
          message: 'Output file (optional):',
          when: !options.output,
        },
      ]);

      const language = options.language || answers.language;
      const description = answers.description;
      const output = options.output || answers.output;

      const spinner = ora('Generating code...').start();

      const llm = createLLMFromEnv();
      const generator = new CodeGenerator(llm);

      const result = await generator.generateCode({
        language,
        description,
        includeTests: options.tests,
        includeComments: options.comments,
      });

      spinner.succeed('Code generated');

      console.log('\n' + chalk.bold.blue('Generated Code'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(result.code);

      if (result.explanation) {
        console.log('\n' + chalk.bold.blue('Explanation'));
        console.log(chalk.gray('─'.repeat(50)));
        console.log(result.explanation);
      }

      if (result.tests) {
        console.log('\n' + chalk.bold.blue('Tests'));
        console.log(chalk.gray('─'.repeat(50)));
        console.log(result.tests);
      }

      if (output) {
        await writeFile(output, result.code, 'utf-8');
        console.log('\n' + chalk.green(`✓ Code saved to ${output}`));

        if (result.tests) {
          const testFile = output.replace(/\.[^.]+$/, '.test$&');
          await writeFile(testFile, result.tests, 'utf-8');
          console.log(chalk.green(`✓ Tests saved to ${testFile}`));
        }
      }
    } catch (error) {
      console.error(chalk.red('Error:'), (error as Error).message);
      process.exit(1);
    }
  });
