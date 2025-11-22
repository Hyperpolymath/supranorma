# Supranorma

> Beyond Normal: A comprehensive suite of AI-powered development tools, data processing framework, and productivity utilities.

## Overview

**Supranorma** is a monorepo containing multiple integrated packages designed to supercharge your development workflow:

- 🤖 **AI Core** - AI integration library for code analysis, generation, and intelligent tooling
- 🛠️ **CLI** - Powerful command-line interface with AI-powered features
- 📊 **Data Framework** - High-performance data processing and transformation framework
- 🌐 **Web App** - Full-stack application for project management and collaboration
- ⚡ **Dev Tools** - Developer productivity suite for automation and code quality

## Quick Start

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm run test

# Start the CLI
npm run cli

# Start the web app
npm run web
```

## Packages

### @supranorma/ai-core
AI integration library providing:
- Code analysis and understanding
- AI-powered code generation
- LLM integration utilities
- Intelligent refactoring suggestions

### @supranorma/cli
Command-line interface featuring:
- AI-powered code analysis
- Project scaffolding
- Automated refactoring
- Code quality checks

### @supranorma/data-framework
Data processing framework with:
- ETL pipelines
- Data transformations
- Plugin architecture
- Stream processing

### @supranorma/web-app
Full-stack web application:
- Modern React/Next.js frontend
- Node.js/Express backend
- Real-time collaboration
- Project management features

### @supranorma/dev-tools
Developer productivity suite:
- Git automation
- Code scaffolding
- Quality metrics
- Workflow automation

### @supranorma/shared
Shared utilities and types used across all packages.

## Development

```bash
# Run type checking
npm run typecheck

# Lint code
npm run lint

# Format code
npm run format

# Clean build artifacts
npm run clean
```

## Architecture

This is a TypeScript monorepo using npm workspaces. Each package is independently versioned and can be published separately, but they work together seamlessly.

```
supranorma/
├── packages/
│   ├── ai-core/         # AI integration library
│   ├── cli/             # Command-line interface
│   ├── data-framework/  # Data processing framework
│   ├── web-app/         # Full-stack web application
│   ├── dev-tools/       # Developer productivity tools
│   └── shared/          # Shared utilities
├── docs/                # Documentation
├── examples/            # Usage examples
└── CLAUDE.md           # AI assistant guide
```

## Documentation

- [Getting Started Guide](docs/getting-started.md)
- [Architecture Overview](docs/architecture.md)
- [API Documentation](docs/api/README.md)
- [Contributing Guide](docs/contributing.md)

## Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0

## License

MIT © Hyperpolymath

## Contributing

See [CONTRIBUTING.md](docs/contributing.md) for development guidelines.
