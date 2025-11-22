import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { writeFile } from 'fs/promises';
import { CodeGenerator } from '@supranorma/ai-core';
import { createLLMFromEnv } from '../utils/llm-factory';
import { readCodeFile } from '../utils/file-utils';

export const testCommand = new Command('test')
  .description('Generate tests for code')
  .argument('<file>', 'File to generate tests for')
  .option('-f, --framework <framework>', 'Test framework to use')
  .option('-o, --output <file>', 'Output file for tests')
  .action(async (file: string, options: { framework?: string; output?: string }) => {
    const spinner = ora('Generating tests...').start();

    try {
      const llm = createLLMFromEnv();
      const generator = new CodeGenerator(llm);

      const { code, language } = await readCodeFile(file);
      const tests = await generator.generateTests(code, language, options.framework);

      spinner.succeed('Tests generated');

      console.log('\n' + chalk.bold.blue('Generated Tests'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(tests);

      const outputFile = options.output || file.replace(/\.[^.]+$/, '.test$&');
      await writeFile(outputFile, tests, 'utf-8');
      console.log('\n' + chalk.green(`✓ Tests saved to ${outputFile}`));
    } catch (error) {
      spinner.fail('Test generation failed');
      console.error(chalk.red('Error:'), (error as Error).message);
      process.exit(1);
    }
  });
