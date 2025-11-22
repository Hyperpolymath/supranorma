# Getting Started with Supranorma

Welcome to Supranorma! This guide will help you get started with the comprehensive suite of AI-powered development tools, data processing framework, and productivity utilities.

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/Hyperpolymath/supranorma.git
cd supranorma

# Install dependencies
npm install

# Build all packages
npm run build
```

### CLI Usage

The Supranorma CLI provides AI-powered code analysis, generation, and more.

```bash
# Initialize configuration
npm run cli init

# Analyze code
npm run cli analyze path/to/file.ts

# Generate code
npm run cli generate

# Start AI chat
npm run cli chat

# Explain code
npm run cli explain path/to/file.ts

# Generate tests
npm run cli test path/to/file.ts
```

### Web Application

Start the full-stack web application:

```bash
# Start backend and frontend
npm run dev -w @supranorma/web-app

# Or start separately
npm run dev:backend -w @supranorma/web-app  # Backend on port 3000
npm run dev:frontend -w @supranorma/web-app  # Frontend on port 5173
```

## Package Overview

### @supranorma/shared

Core utilities and types used across all packages.

```typescript
import { createLogger, retry, debounce } from '@supranorma/shared';

const logger = createLogger({ prefix: 'my-app' });
logger.info('Application started');

// Retry with exponential backoff
await retry(() => fetchData(), { maxAttempts: 3, delay: 1000 });
```

### @supranorma/ai-core

AI integration for code analysis and generation.

```typescript
import { createLLM, CodeAnalyzer, CodeGenerator } from '@supranorma/ai-core';

// Create LLM instance
const llm = createLLM({
  provider: 'anthropic',
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Analyze code
const analyzer = new CodeAnalyzer(llm);
const analysis = await analyzer.analyzeCode(code, 'typescript');

// Generate code
const generator = new CodeGenerator(llm);
const result = await generator.generateCode({
  language: 'typescript',
  description: 'Create a function to validate email addresses',
});
```

### @supranorma/data-framework

High-performance data processing and transformation.

```typescript
import { createPipeline, JsonFileSource, CsvFileSink } from '@supranorma/data-framework';

await createPipeline()
  .from(new JsonFileSource('input.json'))
  .filter((record) => record.active)
  .map((record) => ({ ...record, processed: true }))
  .to(new CsvFileSink('output.csv'))
  .execute();
```

### @supranorma/dev-tools

Developer productivity tools.

```typescript
import { createGitAutomation, createScaffolder } from '@supranorma/dev-tools';

// Git automation
const git = createGitAutomation();
await git.conventionalCommit({
  type: 'feat',
  scope: 'api',
  subject: 'Add new endpoint',
});

// Project scaffolding
const scaffolder = createScaffolder();
await scaffolder.scaffold({
  name: 'my-project',
  template: 'typescript',
});
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# AI Provider Configuration
SUPRANORMA_LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_api_key_here
# Or for OpenAI
# OPENAI_API_KEY=your_api_key_here

# Optional settings
SUPRANORMA_LLM_MODEL=claude-3-5-sonnet-20241022
SUPRANORMA_LLM_MAX_TOKENS=4096
SUPRANORMA_LLM_TEMPERATURE=0.7

# Web App
PORT=3000
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

## Next Steps

- [Architecture Overview](./architecture.md)
- [API Documentation](./api/README.md)
- [Examples](../examples/README.md)
- [Contributing Guide](./contributing.md)

## Support

- GitHub Issues: https://github.com/Hyperpolymath/supranorma/issues
- Documentation: https://github.com/Hyperpolymath/supranorma/tree/main/docs

## License

MIT © Hyperpolymath
