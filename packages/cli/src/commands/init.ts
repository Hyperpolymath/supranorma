import { Command } from 'commander';
import chalk from 'chalk';
import { writeFile } from 'fs/promises';
import inquirer from 'inquirer';

export const initCommand = new Command('init')
  .description('Initialize Supranorma configuration')
  .action(async () => {
    console.log(chalk.bold.blue('Supranorma Configuration'));
    console.log(chalk.gray('─'.repeat(50)) + '\n');

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'provider',
        message: 'Choose AI provider:',
        choices: ['anthropic', 'openai'],
        default: 'anthropic',
      },
      {
        type: 'password',
        name: 'apiKey',
        message: 'API Key:',
        mask: '*',
      },
      {
        type: 'input',
        name: 'model',
        message: 'Model (optional):',
      },
    ]);

    const envContent = `# Supranorma Configuration
SUPRANORMA_LLM_PROVIDER=${answers.provider}
${answers.provider === 'anthropic' ? 'ANTHROPIC_API_KEY' : 'OPENAI_API_KEY'}=${answers.apiKey}
${answers.model ? `SUPRANORMA_LLM_MODEL=${answers.model}` : '# SUPRANORMA_LLM_MODEL='}
# SUPRANORMA_LLM_MAX_TOKENS=4096
# SUPRANORMA_LLM_TEMPERATURE=0.7
`;

    await writeFile('.env', envContent, 'utf-8');

    console.log('\n' + chalk.green('✓ Configuration saved to .env'));
    console.log(chalk.yellow('\nNote: Make sure to add .env to your .gitignore file!'));
  });
