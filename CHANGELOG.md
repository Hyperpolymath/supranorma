# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- RSR (Rhodium Standard Repository) compliance improvements
- Security policy (SECURITY.md)
- Code of Conduct (CODE_OF_CONDUCT.md)
- Maintainers documentation (MAINTAINERS.md)
- .well-known/ directory with security.txt, ai.txt, humans.txt
- Justfile for build automation
- Nix flake for reproducible builds
- Comprehensive test suites for all packages
- Accessibility documentation
- TPCF (Tri-Perimeter Contribution Framework) documentation

## [0.1.0] - 2025-11-22

### Added
- Initial release of Supranorma monorepo
- **@supranorma/shared** - Core utilities package
  - Structured logger with multiple levels
  - Custom error classes (SupranormaError, ValidationError, etc.)
  - Async utilities (AsyncQueue, Semaphore, Mutex, timeout)
  - Common utilities (retry, debounce, throttle, chunk, groupBy, unique)
  - Zod-based schema validation
  - Configuration management system

- **@supranorma/ai-core** - AI integration library
  - Multi-provider LLM support (Anthropic Claude, OpenAI GPT)
  - Code analyzer with quality metrics and complexity analysis
  - AI-powered code generator with test generation
  - Embeddings service with semantic search
  - Chat session manager for conversational AI
  - Prompt builder with templates

- **@supranorma/cli** - Command-line interface
  - `analyze` command for code quality analysis
  - `generate` command for AI-powered code generation
  - `chat` command for interactive AI sessions
  - `refactor` command for refactoring suggestions
  - `explain` command for code explanation
  - `test` command for test generation
  - `init` command for configuration setup

- **@supranorma/data-framework** - Data processing framework
  - Composable pipeline architecture
  - Multiple data sources (JSON, CSV, JSONL, Array, Generator)
  - Multiple data sinks (JSON, CSV, JSONL, Console, Array, Callback)
  - Rich transformers (Map, Filter, Rename, TypeCast, Deduplicate, Join, GroupBy)
  - Validators (Schema, Required, Type, Range, Pattern)
  - Aggregators (Count, Sum, Average, Min, Max, Collect, Unique)
  - Plugin system for extensibility

- **@supranorma/web-app** - Full-stack web application
  - Express.js backend with TypeScript
  - SQLite database with Drizzle ORM
  - JWT authentication system
  - API routes for projects, tasks, users, and AI features
  - React 18 frontend with TypeScript
  - Vite for fast development and optimized builds
  - React Router for client-side routing
  - React Query (TanStack Query) for server state
  - Zustand for client state management
  - Tailwind CSS for styling
  - Responsive UI with dashboard, projects, tasks, and AI assistant pages

- **@supranorma/dev-tools** - Developer productivity suite
  - Git automation with conventional commits
  - Project scaffolding from templates
  - Code quality checker with automated scoring
  - Template engine with EJS and validation

- **Documentation**
  - Comprehensive README with quick start guide
  - Getting started documentation
  - Architecture overview with dependency graph
  - Complete API documentation for all packages
  - Contributing guidelines
  - Usage examples for all major features
  - CLAUDE.md with AI assistant guidance

- **Infrastructure**
  - npm workspaces configuration
  - TypeScript strict mode across all packages
  - ESLint and Prettier for code quality
  - GitHub Actions CI/CD workflows
    - Automated testing on push/PR
    - Release workflow for tagged versions
    - Deployment workflow for main branch
  - Pull request template
  - Issue templates (bug report, feature request)

- **Testing**
  - Vitest configuration for all packages
  - Test structure and examples
  - Test scripts for individual and all packages

### Technical Details

- **Languages**: TypeScript 5.3+
- **Runtime**: Node.js 18+
- **Package Manager**: npm with workspaces
- **Build Tool**: TypeScript compiler, Vite (frontend)
- **Database**: SQLite with Drizzle ORM
- **Frontend**: React 18 + Vite + Tailwind CSS
- **AI Providers**: Anthropic (Claude), OpenAI (GPT)
- **Testing**: Vitest
- **Linting**: ESLint
- **Formatting**: Prettier

### Dependencies

Major dependencies added:
- @anthropic-ai/sdk: ^0.27.0
- openai: ^4.20.0
- express: ^4.18.2
- drizzle-orm: ^0.29.1
- better-sqlite3: ^9.2.2
- react: ^18.2.0
- react-router-dom: ^6.20.0
- @tanstack/react-query: ^5.12.0
- zustand: ^4.4.7
- zod: ^3.22.4
- simple-git: ^3.21.0

### Architecture

- Monorepo structure with 6 independent packages
- Clear dependency graph (shared → ai-core/data-framework/dev-tools → cli/web-app)
- TypeScript strict mode for type safety
- Async-first design for I/O operations
- Structured error handling with context
- Performance optimization (streaming, batching, lazy evaluation)

### Known Limitations

- AI features require external API calls (not fully offline)
- Web app requires API keys for AI functionality
- Frontend requires npm install in subfolder
- No actual test implementations yet (structure only)

## Version History Notes

### Versioning Scheme

We use [Semantic Versioning](https://semver.org/):
- MAJOR version for incompatible API changes
- MINOR version for backwards-compatible functionality
- PATCH version for backwards-compatible bug fixes

### Release Cadence

- **Patch releases**: As needed for bug fixes
- **Minor releases**: Monthly for new features
- **Major releases**: Annually or for breaking changes

### Deprecation Policy

- Features marked deprecated in MINOR release
- Removal in next MAJOR release (minimum 6 months notice)
- Migration guides provided for breaking changes

## Links

- [GitHub Repository](https://github.com/Hyperpolymath/supranorma)
- [Issue Tracker](https://github.com/Hyperpolymath/supranorma/issues)
- [Documentation](https://github.com/Hyperpolymath/supranorma/tree/main/docs)
- [Contributing Guide](https://github.com/Hyperpolymath/supranorma/blob/main/docs/contributing.md)

---

[Unreleased]: https://github.com/Hyperpolymath/supranorma/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Hyperpolymath/supranorma/releases/tag/v0.1.0
