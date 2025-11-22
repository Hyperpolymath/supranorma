# Supranorma Examples

This directory contains practical examples demonstrating how to use different Supranorma packages.

## Examples

### 1. AI Code Analysis

```typescript
// examples/ai-code-analysis.ts
import { createLLM, CodeAnalyzer } from '@supranorma/ai-core';
import { readFile } from 'fs/promises';

async function analyzeCodeExample() {
  // Create LLM instance
  const llm = createLLM({
    provider: 'anthropic',
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  // Create analyzer
  const analyzer = new CodeAnalyzer(llm);

  // Read code file
  const code = await readFile('./sample.ts', 'utf-8');

  // Analyze code
  const analysis = await analyzer.analyzeCode(code, 'typescript');

  console.log('Code Analysis Results:');
  console.log('=====================');
  console.log(`Summary: ${analysis.summary}`);
  console.log(`\nMetrics:`);
  console.log(`  Lines of Code: ${analysis.metrics.linesOfCode}`);
  console.log(`  Complexity: ${analysis.metrics.cyclomaticComplexity}`);
  console.log(`  Maintainability Index: ${analysis.metrics.maintainabilityIndex}`);

  if (analysis.issues.length > 0) {
    console.log(`\nIssues Found:`);
    analysis.issues.forEach((issue, i) => {
      console.log(`  ${i + 1}. [${issue.severity}] ${issue.message}`);
    });
  }

  if (analysis.suggestions.length > 0) {
    console.log(`\nSuggestions:`);
    analysis.suggestions.forEach((suggestion, i) => {
      console.log(`  ${i + 1}. ${suggestion}`);
    });
  }
}

analyzeCodeExample();
```

### 2. Data Processing Pipeline

```typescript
// examples/data-pipeline.ts
import {
  createPipeline,
  JsonFileSource,
  CsvFileSink,
  RenameFieldsTransformer,
  TypeCastTransformer,
} from '@supranorma/data-framework';

async function processingExample() {
  const stats = await createPipeline({ batchSize: 100 })
    .from(new JsonFileSource('users.json'))
    .filter((user: any) => user.active)
    .transform(new RenameFieldsTransformer({
      first_name: 'firstName',
      last_name: 'lastName',
    }))
    .transform(new TypeCastTransformer({
      age: 'number',
      createdAt: 'date',
    }))
    .map((user: any) => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
    }))
    .to(new CsvFileSink('processed-users.csv'))
    .execute();

  console.log('Processing Complete!');
  console.log(`Records Processed: ${stats.recordsProcessed}`);
  console.log(`Records Skipped: ${stats.recordsSkipped}`);
  console.log(`Duration: ${stats.duration}ms`);
}

processingExample();
```

### 3. Git Automation

```typescript
// examples/git-automation.ts
import { createGitAutomation } from '@supranorma/dev-tools';

async function gitExample() {
  const git = createGitAutomation();

  // Check status
  const status = await git.status();
  console.log('Current branch:', await git.getCurrentBranch());
  console.log('Modified files:', status.modified);

  // Create feature branch
  await git.createBranch('feature/new-feature', true);

  // Make changes, then commit
  await git.addAll();
  await git.conventionalCommit({
    type: 'feat',
    scope: 'api',
    subject: 'Add new endpoint for user management',
    body: 'This adds a comprehensive user management API with CRUD operations',
  });

  // Push to remote
  await git.push('origin', 'feature/new-feature');

  console.log('Changes committed and pushed!');
}

gitExample();
```

### 4. Project Scaffolding

```typescript
// examples/scaffolding.ts
import { createScaffolder } from '@supranorma/dev-tools';

async function scaffoldExample() {
  const scaffolder = createScaffolder();

  // List available templates
  const templates = await scaffolder.listTemplates();
  console.log('Available templates:', templates);

  // Create new project
  await scaffolder.scaffold({
    name: 'my-awesome-app',
    template: 'typescript',
    directory: './projects',
    variables: {
      author: 'John Doe',
      description: 'An awesome TypeScript project',
      license: 'MIT',
    },
  });

  console.log('Project scaffolded successfully!');
}

scaffoldExample();
```

### 5. Code Generation

```typescript
// examples/code-generation.ts
import { createLLM, CodeGenerator } from '@supranorma/ai-core';
import { writeFile } from 'fs/promises';

async function generateCodeExample() {
  const llm = createLLM({
    provider: 'anthropic',
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  const generator = new CodeGenerator(llm);

  // Generate function
  const result = await generator.generateCode({
    language: 'typescript',
    description: `
      Create a function that validates an email address.
      It should check for proper format and common domains.
      Return true if valid, false otherwise.
    `,
    includeTests: true,
    includeComments: true,
  });

  // Save generated code
  await writeFile('email-validator.ts', result.code);
  console.log('Code generated and saved!');
  console.log('\nExplanation:', result.explanation);

  if (result.tests) {
    await writeFile('email-validator.test.ts', result.tests);
    console.log('Tests generated and saved!');
  }
}

generateCodeExample();
```

### 6. Chat Session

```typescript
// examples/chat-session.ts
import { createLLM, ChatManager } from '@supranorma/ai-core';
import readline from 'readline';

async function chatExample() {
  const llm = createLLM({
    provider: 'anthropic',
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  const chatManager = new ChatManager(llm);
  const sessionId = chatManager.createSession(undefined, {
    purpose: 'coding-assistant',
  });

  // Add system message
  chatManager.addMessage(sessionId, {
    role: 'system',
    content: 'You are a helpful coding assistant.',
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('Chat started! Type "exit" to quit.\n');

  const askQuestion = () => {
    rl.question('You: ', async (input) => {
      if (input.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      process.stdout.write('Assistant: ');

      await chatManager.streamMessage(
        sessionId,
        input,
        (chunk) => {
          process.stdout.write(chunk);
        }
      );

      console.log('\n');
      askQuestion();
    });
  };

  askQuestion();
}

chatExample();
```

### 7. Quality Checking

```typescript
// examples/quality-check.ts
import { createQualityChecker } from '@supranorma/dev-tools';

async function qualityCheckExample() {
  const checker = createQualityChecker();

  // Check code quality
  const result = await checker.check('./src', '**/*.{ts,tsx}');

  console.log('Code Quality Report');
  console.log('==================');
  console.log(`Status: ${result.passed ? 'PASSED' : 'FAILED'}`);
  console.log(`Score: ${result.score}/100`);
  console.log();

  if (result.errors.length > 0) {
    console.log(`Errors (${result.errors.length}):`);
    result.errors.forEach((error) => {
      console.log(`  ${error.file}:${error.line} - ${error.message}`);
    });
    console.log();
  }

  if (result.warnings.length > 0) {
    console.log(`Warnings (${result.warnings.length}):`);
    result.warnings.slice(0, 10).forEach((warning) => {
      console.log(`  ${warning.file}:${warning.line} - ${warning.message}`);
    });
    if (result.warnings.length > 10) {
      console.log(`  ... and ${result.warnings.length - 10} more`);
    }
  }
}

qualityCheckExample();
```

### 8. Complete Workflow

```typescript
// examples/complete-workflow.ts
import { createLLM, CodeAnalyzer, CodeGenerator } from '@supranorma/ai-core';
import { createGitAutomation } from '@supranorma/dev-tools';
import { writeFile } from 'fs/promises';

async function completeWorkflowExample() {
  console.log('Starting automated workflow...\n');

  // 1. Generate code
  console.log('Step 1: Generating code...');
  const llm = createLLM({
    provider: 'anthropic',
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  const generator = new CodeGenerator(llm);
  const generated = await generator.generateCode({
    language: 'typescript',
    description: 'Create a utility function to format dates',
    includeTests: true,
  });

  await writeFile('date-formatter.ts', generated.code);
  if (generated.tests) {
    await writeFile('date-formatter.test.ts', generated.tests);
  }

  // 2. Analyze code
  console.log('Step 2: Analyzing generated code...');
  const analyzer = new CodeAnalyzer(llm);
  const analysis = await analyzer.analyzeCode(generated.code, 'typescript');

  console.log(`Quality Score: ${analysis.metrics.maintainabilityIndex}/100`);

  // 3. Git operations
  console.log('Step 3: Committing changes...');
  const git = createGitAutomation();

  await git.add(['date-formatter.ts', 'date-formatter.test.ts']);
  await git.conventionalCommit({
    type: 'feat',
    scope: 'utils',
    subject: 'Add date formatting utility',
  });

  console.log('\nWorkflow complete!');
  console.log('✓ Code generated');
  console.log('✓ Code analyzed');
  console.log('✓ Changes committed');
}

completeWorkflowExample();
```

## Running Examples

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Run an example
npx tsx examples/ai-code-analysis.ts
npx tsx examples/data-pipeline.ts
npx tsx examples/git-automation.ts
```

## Sample Data

The `examples/data/` directory contains sample data files for testing:

- `users.json` - Sample user data
- `products.csv` - Sample product data
- `logs.jsonl` - Sample log data

## Next Steps

- Explore the [API Documentation](../docs/api/README.md)
- Read the [Architecture Guide](../docs/architecture.md)
- Check out the [Contributing Guide](../docs/contributing.md)
