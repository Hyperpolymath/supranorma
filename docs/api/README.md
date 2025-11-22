# API Documentation

## Table of Contents

- [Shared Package API](#shared-package-api)
- [AI Core API](#ai-core-api)
- [Data Framework API](#data-framework-api)
- [Dev Tools API](#dev-tools-api)
- [Web App API](#web-app-api)

## Shared Package API

### Logger

```typescript
import { createLogger, LogLevel } from '@supranorma/shared';

const logger = createLogger({
  level: LogLevel.INFO,
  prefix: 'my-app',
  timestamps: true,
});

logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
logger.success('Success message');
```

### Utilities

```typescript
import {
  sleep,
  retry,
  debounce,
  throttle,
  chunk,
  groupBy,
  unique,
  pick,
  omit,
} from '@supranorma/shared';

// Sleep
await sleep(1000); // 1 second

// Retry with exponential backoff
await retry(() => fetchData(), {
  maxAttempts: 3,
  delay: 1000,
  backoff: 2,
  onRetry: (attempt, error) => console.log(`Retry ${attempt}:`, error),
});

// Debounce
const debouncedFn = debounce((value) => console.log(value), 300);

// Throttle
const throttledFn = throttle((value) => console.log(value), 1000);

// Chunk array
const chunks = chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]

// Group by
const grouped = groupBy(users, (user) => user.role);

// Unique values
const uniqueUsers = unique(users, (user) => user.id);

// Pick fields
const userInfo = pick(user, ['id', 'name', 'email']);

// Omit fields
const publicUser = omit(user, ['password', 'secretKey']);
```

### Async Utilities

```typescript
import { AsyncQueue, Semaphore, Mutex, timeout } from '@supranorma/shared';

// Async queue with concurrency limit
const queue = new AsyncQueue(5); // max 5 concurrent tasks
queue.add(() => fetchData(1));
queue.add(() => fetchData(2));
const results = await queue.drain();

// Semaphore
const semaphore = new Semaphore(3); // max 3 concurrent
await semaphore.run(async () => {
  // Your async work here
});

// Mutex
const mutex = new Mutex();
await mutex.run(async () => {
  // Critical section
});

// Timeout
const result = await timeout(fetchData(), 5000, 'Request timeout');
```

## AI Core API

### LLM

```typescript
import { createLLM } from '@supranorma/ai-core';

const llm = createLLM({
  provider: 'anthropic', // or 'openai'
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3-5-sonnet-20241022',
  maxTokens: 4096,
  temperature: 0.7,
});

// Complete
const response = await llm.complete({
  messages: [
    { role: 'system', content: 'You are a helpful assistant' },
    { role: 'user', content: 'Hello!' },
  ],
  maxTokens: 1000,
  temperature: 0.5,
});

// Stream
await llm.stream(
  {
    messages: [{ role: 'user', content: 'Tell me a story' }],
  },
  (chunk) => {
    process.stdout.write(chunk);
  }
);
```

### Code Analyzer

```typescript
import { CodeAnalyzer } from '@supranorma/ai-core';

const analyzer = new CodeAnalyzer(llm);

const analysis = await analyzer.analyzeCode(code, 'typescript');
console.log(analysis.summary);
console.log(analysis.issues);
console.log(analysis.suggestions);
console.log(analysis.metrics);

const refactoring = await analyzer.suggestRefactoring(code, 'typescript');
const explanation = await analyzer.explainCode(code, 'typescript');
```

### Code Generator

```typescript
import { CodeGenerator } from '@supranorma/ai-core';

const generator = new CodeGenerator(llm);

const result = await generator.generateCode({
  language: 'typescript',
  description: 'Create a function to validate email addresses',
  includeTests: true,
  includeComments: true,
});

console.log(result.code);
console.log(result.explanation);
console.log(result.tests);

// Generate tests
const tests = await generator.generateTests(code, 'typescript', 'vitest');

// Fix code
const fixed = await generator.fixCode(code, 'typescript', errorMessage);
```

### Embeddings

```typescript
import { EmbeddingService } from '@supranorma/ai-core';

const embeddingService = new EmbeddingService(apiKey);

// Generate embedding
const { embedding } = await embeddingService.embed('Hello world');

// Semantic search
const results = await embeddingService.semanticSearch(
  'query text',
  documents.map((doc) => ({ content: doc })),
  { topK: 5 }
);

console.log(results[0].content);
console.log(results[0].similarity);
```

### Chat Manager

```typescript
import { ChatManager } from '@supranorma/ai-core';

const chatManager = new ChatManager(llm);

const sessionId = chatManager.createSession();

const response = await chatManager.sendMessage(sessionId, 'Hello!');

// Stream response
await chatManager.streamMessage(
  sessionId,
  'Tell me about TypeScript',
  (chunk) => {
    process.stdout.write(chunk);
  }
);

// Export session
const session = chatManager.exportSession(sessionId);
```

## Data Framework API

### Pipeline

```typescript
import { createPipeline } from '@supranorma/data-framework';

const stats = await createPipeline({ batchSize: 100, concurrency: 10 })
  .from(source)
  .filter((record) => record.active)
  .map((record) => ({ ...record, processed: true }))
  .transform(customTransformer)
  .to(sink)
  .execute();

console.log(stats.recordsProcessed);
console.log(stats.recordsSkipped);
console.log(stats.duration);
```

### Sources

```typescript
import {
  ArraySource,
  JsonFileSource,
  CsvFileSource,
  JsonLinesSource,
} from '@supranorma/data-framework';

// Array source
const source1 = new ArraySource(data);

// JSON file
const source2 = new JsonFileSource('data.json');

// CSV file
const source3 = new CsvFileSource('data.csv', {
  delimiter: ',',
  header: true,
});

// JSON Lines
const source4 = new JsonLinesSource('data.jsonl');
```

### Sinks

```typescript
import {
  ArraySink,
  JsonFileSink,
  CsvFileSink,
  ConsoleSink,
} from '@supranorma/data-framework';

// Array sink
const sink1 = new ArraySink();
// ... after pipeline execution
const results = sink1.getData();

// JSON file
const sink2 = new JsonFileSink('output.json', { pretty: true });

// CSV file
const sink3 = new CsvFileSink('output.csv', { includeHeaders: true });

// Console
const sink4 = new ConsoleSink({ pretty: true, limit: 10 });
```

### Transformers

```typescript
import {
  RenameFieldsTransformer,
  SelectFieldsTransformer,
  TypeCastTransformer,
  DeduplicateTransformer,
} from '@supranorma/data-framework';

// Rename fields
pipeline.transform(new RenameFieldsTransformer({
  old_name: 'new_name',
}));

// Select fields
pipeline.transform(new SelectFieldsTransformer(['id', 'name', 'email']));

// Type casting
pipeline.transform(new TypeCastTransformer({
  age: 'number',
  active: 'boolean',
  createdAt: 'date',
}));

// Deduplicate
pipeline.transform(new DeduplicateTransformer((record) => record.id));
```

## Dev Tools API

### Git Automation

```typescript
import { createGitAutomation } from '@supranorma/dev-tools';

const git = createGitAutomation();

// Status
const status = await git.status();

// Create branch
await git.createBranch('feature/new-feature', true);

// Commit
await git.add('.');
await git.commit('Add new feature');

// Conventional commit
await git.conventionalCommit({
  type: 'feat',
  scope: 'api',
  subject: 'Add new endpoint',
  body: 'Detailed description',
  breaking: false,
});

// Push
await git.push('origin', 'main');
```

### Project Scaffolder

```typescript
import { createScaffolder } from '@supranorma/dev-tools';

const scaffolder = createScaffolder();

await scaffolder.scaffold({
  name: 'my-project',
  template: 'typescript',
  directory: './projects',
  variables: {
    author: 'John Doe',
    description: 'My awesome project',
  },
});

// List available templates
const templates = await scaffolder.listTemplates();
```

### Code Quality

```typescript
import { createQualityChecker } from '@supranorma/dev-tools';

const checker = createQualityChecker();

const result = await checker.check('./src');

console.log(`Passed: ${result.passed}`);
console.log(`Score: ${result.score}/100`);
console.log(`Errors: ${result.errors.length}`);
console.log(`Warnings: ${result.warnings.length}`);
```

## Web App API

### Authentication

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Projects

```http
GET /api/projects
Authorization: Bearer {token}

POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "My Project",
  "description": "Project description"
}

GET /api/projects/:id
Authorization: Bearer {token}

PATCH /api/projects/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name"
}

DELETE /api/projects/:id
Authorization: Bearer {token}
```

### Tasks

```http
GET /api/tasks?projectId={projectId}
Authorization: Bearer {token}

POST /api/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Task Title",
  "description": "Task description",
  "projectId": "project_id",
  "priority": "high"
}
```

### AI

```http
POST /api/ai/analyze
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "function example() { ... }",
  "language": "typescript"
}

POST /api/ai/generate
Authorization: Bearer {token}
Content-Type: application/json

{
  "description": "Create a function to validate emails",
  "language": "typescript",
  "includeTests": true
}

POST /api/ai/chat
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "How do I implement authentication?",
  "history": []
}
```
