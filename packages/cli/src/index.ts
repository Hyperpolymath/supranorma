#!/usr/bin/env node

import { Command } from 'commander';
import { config } from 'dotenv';
import chalk from 'chalk';
import { analyzeCommand } from './commands/analyze';
import { generateCommand } from './commands/generate';
import { chatCommand } from './commands/chat';
import { refactorCommand } from './commands/refactor';
import { explainCommand } from './commands/explain';
import { testCommand } from './commands/test';
import { initCommand } from './commands/init';

// Load environment variables
config();

const program = new Command();

program
  .name('supranorma')
  .description('AI-powered developer tools for code analysis, generation, and more')
  .version('0.1.0');

// Register commands
program.addCommand(analyzeCommand);
program.addCommand(generateCommand);
program.addCommand(chatCommand);
program.addCommand(refactorCommand);
program.addCommand(explainCommand);
program.addCommand(testCommand);
program.addCommand(initCommand);

// Global error handler
process.on('unhandledRejection', (error: Error) => {
  console.error(chalk.red('Error:'), error.message);
  process.exit(1);
});

program.parse(process.argv);
