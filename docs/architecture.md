# Architecture Overview

Supranorma is designed as a modular monorepo with multiple integrated packages that work together to provide a comprehensive development platform.

## Project Structure

```
supranorma/
├── packages/
│   ├── shared/              # Core utilities and types
│   ├── ai-core/            # AI integration library
│   ├── cli/                # Command-line interface
│   ├── data-framework/     # Data processing framework
│   ├── web-app/            # Full-stack web application
│   │   ├── backend/        # Express backend
│   │   └── frontend/       # React frontend
│   └── dev-tools/          # Developer productivity tools
├── docs/                   # Documentation
├── examples/               # Usage examples
└── .github/                # CI/CD workflows
```

## Package Dependencies

```
@supranorma/shared (foundation)
    ↑
    ├── @supranorma/ai-core
    │       ↑
    │       ├── @supranorma/cli
    │       └── @supranorma/web-app (backend)
    ├── @supranorma/data-framework
    └── @supranorma/dev-tools
```

## Core Components

### Shared Package

The foundation of all packages, providing:

- **Logger**: Structured logging with multiple levels
- **Error Handling**: Custom error classes with context
- **Utilities**: Common functions (retry, debounce, etc.)
- **Validators**: Zod-based schema validation
- **Async Helpers**: Promises, queues, semaphores
- **Config Management**: Configuration loading and watching

### AI Core Package

AI integration layer supporting multiple providers:

- **LLM Abstraction**: Unified interface for Anthropic and OpenAI
- **Code Analyzer**: Analyze code quality and complexity
- **Code Generator**: Generate code from descriptions
- **Embeddings**: Semantic search and similarity
- **Chat Manager**: Conversational AI sessions
- **Prompt Builder**: Template-based prompt construction

### Data Framework Package

High-performance data processing:

- **Pipeline**: Composable data transformation pipeline
- **Sources**: JSON, CSV, JSONL, and custom sources
- **Sinks**: Multiple output formats
- **Transformers**: Map, filter, aggregate, join operations
- **Validators**: Schema and rule-based validation
- **Plugins**: Extensible plugin system

### CLI Package

Command-line interface for AI-powered tools:

- **analyze**: Code analysis and quality metrics
- **generate**: AI-powered code generation
- **chat**: Interactive AI chat sessions
- **refactor**: Automated refactoring suggestions
- **explain**: Code explanation
- **test**: Test generation

### Web App Package

Full-stack application with:

#### Backend
- **Express Server**: RESTful API
- **Database**: SQLite with Drizzle ORM
- **Authentication**: JWT-based auth
- **API Routes**: Projects, tasks, users, AI

#### Frontend
- **React + Vite**: Modern frontend stack
- **React Router**: Client-side routing
- **React Query**: Server state management
- **Zustand**: Client state management
- **Tailwind CSS**: Utility-first styling

### Dev Tools Package

Developer productivity automation:

- **Git Automation**: Simplified git operations
- **Project Scaffolding**: Template-based project generation
- **Code Quality**: Automated quality checks
- **Template Engine**: EJS-based templating

## Design Principles

### 1. Modularity

Each package is independently versioned and can be used standalone or together. Dependencies are clearly defined and minimal.

### 2. Type Safety

TypeScript throughout with strict mode enabled. Comprehensive type definitions and inference.

### 3. Error Handling

Structured error handling with custom error classes. All errors include context and are properly propagated.

### 4. Async-First

All I/O operations are asynchronous. Proper handling of promises and async iterators.

### 5. Testability

Code designed for testability with dependency injection and clear interfaces.

### 6. Performance

- Streaming for large datasets
- Batching for efficiency
- Caching where appropriate
- Lazy evaluation

### 7. Developer Experience

- Clear APIs
- Comprehensive documentation
- Helpful error messages
- Type inference

## Data Flow

### CLI Workflow

```
User Input → CLI Command → AI Core → LLM Provider → Response → Formatted Output
```

### Web App Workflow

```
Frontend → API Request → Backend Routes → Database/AI Core → Response → Frontend Update
```

### Data Processing Workflow

```
Source → Pipeline → Transformers → Validators → Aggregators → Sink
```

## Technology Stack

### Core
- TypeScript 5.3
- Node.js 18+
- npm workspaces

### AI Integration
- Anthropic SDK
- OpenAI SDK
- tiktoken

### Backend
- Express
- SQLite + Drizzle ORM
- JWT authentication
- bcryptjs

### Frontend
- React 18
- Vite
- React Router
- React Query
- Zustand
- Tailwind CSS

### Developer Tools
- simple-git
- EJS templating
- globby
- execa

### Testing & Quality
- Vitest
- ESLint
- Prettier
- TypeScript

## Security Considerations

- Environment-based secrets
- JWT token authentication
- Password hashing with bcryptjs
- SQL injection prevention via ORM
- CORS configuration
- Helmet.js security headers
- Input validation with Zod

## Scalability

### Horizontal Scaling
- Stateless API design
- Database connection pooling
- Caching strategies

### Vertical Scaling
- Streaming for large files
- Batching for bulk operations
- Lazy loading

## Future Enhancements

- WebSocket support for real-time features
- Message queue integration
- Distributed caching
- Multi-database support
- Plugin marketplace
- Cloud deployment templates
