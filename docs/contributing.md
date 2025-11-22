# Contributing to Supranorma

Thank you for your interest in contributing to Supranorma! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and collaborative. We're here to build great software together.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/supranorma.git
cd supranorma

# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Changes

- Write clean, well-documented code
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run type checking
npm run typecheck

# Run linter
npm run lint

# Run tests
npm test

# Format code
npm run format
```

### 4. Commit Your Changes

We use conventional commits. Format: `type(scope): subject`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions/changes
- `chore`: Build process or auxiliary tool changes

Examples:
```bash
git commit -m "feat(cli): add new analyze command"
git commit -m "fix(api): resolve authentication bug"
git commit -m "docs(readme): update installation instructions"
```

### 5. Push and Create PR

```bash
git push origin your-branch-name
```

Then create a pull request on GitHub.

## Project Structure

```
supranorma/
├── packages/
│   ├── shared/           # Core utilities
│   ├── ai-core/         # AI integration
│   ├── cli/             # CLI tools
│   ├── data-framework/  # Data processing
│   ├── web-app/         # Web application
│   └── dev-tools/       # Developer tools
├── docs/                # Documentation
├── examples/            # Usage examples
└── .github/             # CI/CD workflows
```

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Define types explicitly where inference isn't clear
- Avoid `any` - use `unknown` if type is truly unknown
- Use interfaces for objects, types for unions/intersections
- Document complex types

### Code Style

- Follow the existing code style
- Use Prettier for formatting (automatic)
- Use ESLint rules (will be checked in CI)
- Maximum line length: 100 characters
- Use meaningful variable names

### Documentation

- Document all public APIs
- Include JSDoc comments for functions
- Update README.md when adding features
- Add examples for new functionality

### Testing

- Write unit tests for new code
- Maintain or improve code coverage
- Test edge cases and error conditions
- Use descriptive test names

Example:
```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      // Test implementation
    });

    it('should throw ValidationError for invalid email', async () => {
      // Test implementation
    });
  });
});
```

## Package Development

### Adding a New Package

1. Create package directory:
```bash
mkdir packages/your-package
```

2. Create package.json:
```json
{
  "name": "@supranorma/your-package",
  "version": "0.1.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "vitest run"
  }
}
```

3. Create tsconfig.json extending root config
4. Add package to root package.json workspaces
5. Update documentation

### Modifying Existing Packages

1. Make changes in the package's `src/` directory
2. Add/update tests
3. Rebuild: `npm run build -w @supranorma/package-name`
4. Test: `npm test -w @supranorma/package-name`

## Pull Request Process

1. **Update Documentation**: Ensure README and docs are updated
2. **Add Tests**: New features must include tests
3. **Pass CI**: All checks must pass
4. **Code Review**: Address reviewer feedback
5. **Squash Commits**: Maintain clean history

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Code is commented where necessary
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] No new warnings
- [ ] Dependent changes merged

## Release Process

Maintainers will handle releases:

1. Update version in package.json files
2. Update CHANGELOG.md
3. Create git tag
4. Push tag to trigger release workflow
5. Publish to npm

## Getting Help

- GitHub Issues: Bug reports and feature requests
- Discussions: Questions and general discussion
- Documentation: Check docs/ directory

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md
- Release notes
- Project README

Thank you for contributing to Supranorma!
