# CLAUDE.md

This file provides context and guidance for AI assistants (like Claude) working on the Supranorma project.

## Project Overview

**Supranorma** (meaning "beyond normal") is a comprehensive TypeScript monorepo providing an integrated suite of tools for modern development:

- **AI-Powered Development Tools** - Code analysis, generation, and intelligent assistance
- **Data Processing Framework** - High-performance ETL and transformation pipelines
- **Full-Stack Web Application** - Project management with AI integration
- **Developer Productivity Suite** - Git automation, scaffolding, and code quality tools
- **CLI Interface** - Command-line access to all features

### Key Technologies

**Core:**
- TypeScript 5.3+ (strict mode)
- Node.js 18+
- npm workspaces (monorepo)

**AI Integration:**
- Anthropic SDK (Claude)
- OpenAI SDK (GPT-4)
- tiktoken (token counting)

**Backend:**
- Express.js
- SQLite + Drizzle ORM
- JWT Authentication
- bcryptjs (password hashing)

**Frontend:**
- React 18
- Vite
- React Router
- React Query (TanStack Query)
- Zustand (state management)
- Tailwind CSS

**Data Processing:**
- PapaParse (CSV)
- XLSX
- Stream processing
- Plugin architecture

**Developer Tools:**
- simple-git
- EJS templating
- globby (file globbing)
- execa (command execution)

**Testing & Quality:**
- Vitest
- ESLint
- Prettier
- TypeScript strict mode

## Project Structure

```
supranorma/
├── packages/
│   ├── shared/                 # Core utilities (logger, errors, async, config)
│   ├── ai-core/               # AI integration (LLM, code analysis, generation)
│   ├── cli/                   # CLI interface (analyze, generate, chat, etc.)
│   ├── data-framework/        # ETL pipelines (sources, sinks, transformers)
│   ├── web-app/              # Full-stack app
│   │   ├── backend/          #   Express API + SQLite
│   │   └── frontend/         #   React + Vite
│   └── dev-tools/            # Git, scaffolding, quality checks
├── docs/                      # Documentation
│   ├── getting-started.md
│   ├── architecture.md
│   ├── api/
│   └── contributing.md
├── examples/                  # Usage examples
├── .github/
│   ├── workflows/            # CI/CD (test, release, deploy)
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
├── package.json              # Root workspace config
├── tsconfig.json             # Base TypeScript config
└── CLAUDE.md                 # This file
```

## Development Setup

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- API keys (Anthropic or OpenAI)

### Installation
```bash
# Clone the repository
git clone https://github.com/Hyperpolymath/supranorma.git
cd supranorma

# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test

# Type check
npm run typecheck
```

### Environment Setup
```bash
# Create .env file
cp .env.example .env

# Required variables:
SUPRANORMA_LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_key_here
# or
# OPENAI_API_KEY=your_key_here

# Optional:
SUPRANORMA_LLM_MODEL=claude-3-5-sonnet-20241022
SUPRANORMA_LLM_MAX_TOKENS=4096
SUPRANORMA_LLM_TEMPERATURE=0.7
```

## Architecture

### Dependency Graph
```
@supranorma/shared (foundation)
    ↑
    ├── @supranorma/ai-core
    │       ↑
    │       ├── @supranorma/cli
    │       └── @supranorma/web-app/backend
    ├── @supranorma/data-framework
    └── @supranorma/dev-tools

@supranorma/web-app/frontend (independent)
```

### Core Design Principles

1. **Modularity** - Each package is independently versioned and usable
2. **Type Safety** - Strict TypeScript with comprehensive types
3. **Async-First** - All I/O operations are asynchronous
4. **Error Handling** - Structured errors with context
5. **Performance** - Streaming, batching, lazy evaluation
6. **Testability** - Dependency injection, clear interfaces

### Key Components

#### @supranorma/shared
Foundation utilities used across all packages:
- **Logger** - Structured logging with levels
- **Error Classes** - SupranormaError, ValidationError, etc.
- **Async Utilities** - AsyncQueue, Semaphore, Mutex, timeout
- **Utils** - retry, debounce, throttle, chunk, groupBy, etc.
- **Validators** - Zod-based schema validation
- **Config Manager** - Configuration loading and watching

#### @supranorma/ai-core
AI integration with multiple providers:
- **LLM Factory** - Unified interface for Anthropic/OpenAI
- **Code Analyzer** - Analyze quality, complexity, issues
- **Code Generator** - Generate code, tests, fixes
- **Embeddings** - Vector embeddings, semantic search
- **Chat Manager** - Conversational AI sessions
- **Prompt Builder** - Template-based prompts

#### @supranorma/cli
Command-line interface:
- `analyze <file>` - Analyze code quality
- `generate` - Generate code from description
- `chat` - Interactive AI chat
- `refactor <file>` - Get refactoring suggestions
- `explain <file>` - Explain code
- `test <file>` - Generate tests
- `init` - Initialize configuration

#### @supranorma/data-framework
High-performance data processing:
- **Pipeline** - Composable transformation pipeline
- **Sources** - JSON, CSV, JSONL, Array, Generator
- **Sinks** - JSON, CSV, JSONL, Console, Array, Callback
- **Transformers** - Map, Filter, Rename, TypeCast, Deduplicate, etc.
- **Validators** - Schema, Required, Type, Range, Pattern
- **Aggregators** - Count, Sum, Average, Min, Max, Collect

#### @supranorma/web-app
Full-stack application:

**Backend:**
- Express server with middleware (helmet, cors, auth)
- SQLite database with Drizzle ORM
- JWT authentication
- API routes: /auth, /projects, /tasks, /ai, /users
- Error handling middleware

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- React Router for routing
- React Query for server state
- Zustand for client state
- Tailwind CSS for styling
- Pages: Login, Register, Dashboard, Projects, Tasks, AI Assistant

#### @supranorma/dev-tools
Developer productivity automation:
- **Git Automation** - Commits, branches, push, conventional commits
- **Project Scaffolder** - Template-based project generation
- **Code Quality Checker** - Automated quality checks and scoring
- **Template Engine** - EJS rendering with validation

## Coding Conventions

### General Guidelines
- Write clear, self-documenting code
- Functions should do one thing well
- Prefer composition over inheritance
- Avoid premature optimization
- Write tests for new functionality
- Document public APIs with JSDoc
- Keep files focused and under 300 lines

### TypeScript Style
- Use strict mode (enabled by default)
- Define explicit return types for public functions
- Avoid `any` - use `unknown` if type is truly unknown
- Use interfaces for objects, types for unions/intersections
- Export types alongside implementations
- Use const assertions where appropriate

### Naming Conventions
- **Files**: kebab-case.ts or PascalCase.tsx (React)
- **Variables/Functions**: camelCase
- **Classes/Interfaces/Types**: PascalCase
- **Constants**: UPPER_SNAKE_CASE
- **Private fields**: _prefixed (when needed)

### Code Style (enforced by Prettier)
- 100 character line length
- 2 space indentation
- Single quotes
- Semicolons required
- Trailing commas in multiline

### Error Handling
```typescript
// Use custom error classes
throw new ValidationError('Invalid email', { email });

// Handle errors with context
try {
  await operation();
} catch (error) {
  if (isSupranormaError(error)) {
    logger.error(error.message, error.meta);
  }
  throw error;
}

// Use Result type for expected failures
function parse(input: string): Result<Data, Error> {
  try {
    return { success: true, data: JSON.parse(input) };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```

## Testing

### Test Structure
```
package/
├── src/
│   ├── index.ts
│   └── feature.ts
└── tests/
    └── feature.test.ts
```

### Running Tests
```bash
# All packages
npm test

# Specific package
npm test -w @supranorma/ai-core

# Watch mode
npm run test:watch -w @supranorma/shared
```

### Writing Tests
```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('FeatureName', () => {
  beforeEach(() => {
    // Setup
  });

  it('should handle normal case', () => {
    expect(normalCase()).toBe(expected);
  });

  it('should handle edge case', () => {
    expect(edgeCase()).toBe(expected);
  });

  it('should throw on invalid input', () => {
    expect(() => invalidInput()).toThrow(ValidationError);
  });
});
```

## Common Tasks

### Adding New Features
1. Create feature branch: `git checkout -b feature/your-feature-name`
2. Implement in appropriate package
3. Add tests
4. Update TypeScript types
5. Update documentation
6. Submit PR with tests passing

### Adding a New Package
1. Create directory in `packages/`
2. Add package.json with workspace reference
3. Add tsconfig.json extending root config
4. Implement in `src/index.ts`
5. Add tests
6. Update root README.md

### Working with AI Features
```typescript
// Always use environment-based API keys
const llm = createLLM({
  provider: process.env.SUPRANORMA_LLM_PROVIDER as 'anthropic' | 'openai',
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY,
});

// Handle streaming responses
await llm.stream({ messages }, (chunk) => {
  process.stdout.write(chunk);
});

// Always handle errors
try {
  const result = await analyzer.analyzeCode(code, language);
} catch (error) {
  if (isSupranormaError(error)) {
    logger.error('Analysis failed:', error.message);
  }
}
```

### Debugging
- Use the logger instead of console.log
- Enable debug level: `logger.setLevel(LogLevel.DEBUG)`
- Check TypeScript errors: `npm run typecheck`
- Use VS Code debugger with breakpoints
- Check network requests in browser DevTools

### Performance Optimization
- Use streaming for large files
- Batch operations where possible
- Use AsyncQueue for concurrent operations
- Enable caching for expensive computations
- Profile with Node.js --prof flag

## AI Assistant Guidelines

### When Working on This Project

1. **Understand Before Changing**: Read relevant files completely before making changes. Use Grep to find related code.

2. **Maintain Consistency**: Match existing patterns, naming, and structure. Check similar files for reference.

3. **Preserve Type Safety**: Never use `any` without strong justification. Add types for all new code.

4. **Test Thoroughly**: Add tests for new features. Ensure existing tests pass. Test edge cases.

5. **Document Changes**: Update JSDoc comments, README files, and this CLAUDE.md when making significant changes.

6. **Handle Errors**: Use appropriate error classes. Never swallow errors. Always add context.

7. **Respect Dependencies**: Don't introduce circular dependencies. Keep shared package dependency-free.

8. **Consider Performance**: Stream large datasets. Batch API calls. Use lazy evaluation.

9. **Security First**: Never commit API keys. Validate all inputs. Sanitize user data. Use parameterized queries.

10. **Ask When Uncertain**: If requirements are ambiguous, ask rather than assume.

### Key Files to Reference

**Architecture & Setup:**
- `package.json` - Workspace configuration
- `tsconfig.json` - TypeScript configuration
- `docs/architecture.md` - Architecture overview

**Core Utilities:**
- `packages/shared/src/logger.ts` - Logging
- `packages/shared/src/errors.ts` - Error handling
- `packages/shared/src/utils.ts` - Common utilities

**AI Integration:**
- `packages/ai-core/src/llm/index.ts` - LLM factory
- `packages/ai-core/src/code-analyzer.ts` - Code analysis
- `packages/ai-core/src/code-generator.ts` - Code generation

**Data Processing:**
- `packages/data-framework/src/pipeline.ts` - Pipeline core
- `packages/data-framework/src/transformers.ts` - Transformers

**Web Application:**
- `packages/web-app/backend/src/server.ts` - Backend entry
- `packages/web-app/backend/src/routes/` - API routes
- `packages/web-app/frontend/src/App.tsx` - Frontend entry

### Common Pitfalls to Avoid

1. **Import Paths**: Use package names (`@supranorma/shared`), not relative paths between packages
2. **Circular Dependencies**: Don't import from ai-core in shared package
3. **API Keys**: Never hardcode or commit API keys
4. **Async/Await**: Always await promises, don't forget async keyword
5. **Error Handling**: Don't use try/catch without re-throwing or logging
6. **Type Safety**: Don't use `as any` to bypass type errors
7. **Database**: Always use Drizzle ORM, never raw SQL
8. **Frontend State**: Use React Query for server state, Zustand for client state
9. **File Paths**: Use absolute paths in package.json scripts
10. **Environment Variables**: Check for required env vars on startup

## Dependencies

### Core Dependencies
- **@anthropic-ai/sdk** - Anthropic Claude API
- **openai** - OpenAI GPT API
- **express** - Web server framework
- **drizzle-orm** - Database ORM
- **better-sqlite3** - SQLite database
- **react** - UI library
- **react-query** - Server state management
- **zod** - Schema validation
- **simple-git** - Git automation

### Development Dependencies
- **typescript** - Type system
- **vitest** - Testing framework
- **eslint** - Code linting
- **prettier** - Code formatting
- **vite** - Frontend build tool

## Deployment

### Backend Deployment
```bash
# Build backend
npm run build:backend -w @supranorma/web-app

# Set environment variables
export NODE_ENV=production
export JWT_SECRET=your_secret
export ANTHROPIC_API_KEY=your_key

# Run
node packages/web-app/dist/backend/server.js
```

### Frontend Deployment
```bash
# Build frontend
npm run build:frontend -w @supranorma/web-app

# Deploy dist/ to static hosting (Vercel, Netlify, etc.)
```

### CI/CD
- **GitHub Actions** configured for:
  - Testing on push/PR
  - Release on tag
  - Deployment on main branch
- See `.github/workflows/` for details

## Resources

### Documentation
- [Getting Started](docs/getting-started.md)
- [Architecture](docs/architecture.md)
- [API Documentation](docs/api/README.md)
- [Contributing](docs/contributing.md)
- [Examples](examples/README.md)

### External Resources
- [Anthropic API Docs](https://docs.anthropic.com/)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [React Query Docs](https://tanstack.com/query/latest)

## Contributing

See [CONTRIBUTING.md](docs/contributing.md) for:
- Development workflow
- Code standards
- PR process
- Testing requirements

## Notes for AI Assistants

- **Keep this file updated** as you make architectural changes
- **Document patterns** when you establish new conventions
- **Add warnings** when you discover gotchas
- **Be specific** with examples and file paths
- **Stay concise** - this is a reference, not a tutorial

## Changelog

This section tracks major updates to project architecture and conventions:

- **2025-11-22**: Complete project implementation
  - Built 6 packages: shared, ai-core, cli, data-framework, web-app, dev-tools
  - Added comprehensive documentation and examples
  - Set up CI/CD with GitHub Actions
  - Created full-stack web application
  - Implemented AI-powered developer tools

- **2025-11-21**: Initial CLAUDE.md created

---

*Last updated: 2025-11-22*
