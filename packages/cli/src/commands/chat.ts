import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { ChatManager } from '@supranorma/ai-core';
import { createLLMFromEnv } from '../utils/llm-factory';

export const chatCommand = new Command('chat')
  .description('Start an interactive AI chat session')
  .option('-s, --system <message>', 'System message')
  .action(async (options: { system?: string }) => {
    try {
      const llm = createLLMFromEnv();
      const chatManager = new ChatManager(llm);

      const sessionId = chatManager.createSession();

      if (options.system) {
        chatManager.addMessage(sessionId, {
          role: 'system',
          content: options.system,
        });
      }

      console.log(chalk.bold.blue('AI Chat Session'));
      console.log(chalk.gray('Type "exit" to quit, "clear" to clear history\n'));

      let running = true;

      while (running) {
        const { message } = await inquirer.prompt([
          {
            type: 'input',
            name: 'message',
            message: chalk.green('You:'),
          },
        ]);

        if (message.toLowerCase() === 'exit') {
          running = false;
          console.log(chalk.yellow('Goodbye!'));
          break;
        }

        if (message.toLowerCase() === 'clear') {
          chatManager.clearMessages(sessionId);
          console.log(chalk.yellow('Chat history cleared'));
          continue;
        }

        if (!message.trim()) {
          continue;
        }

        process.stdout.write(chalk.blue('AI: '));

        let responseText = '';

        await chatManager.streamMessage(
          sessionId,
          message,
          (chunk) => {
            process.stdout.write(chunk);
            responseText += chunk;
          }
        );

        console.log('\n');
      }
    } catch (error) {
      console.error(chalk.red('Error:'), (error as Error).message);
      process.exit(1);
    }
  });
