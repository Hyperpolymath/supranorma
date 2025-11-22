# Supranorma Justfile
# Build automation for the Supranorma monorepo
# Install just: https://github.com/casey/just

# Default recipe - show available commands
default:
    @just --list

# === Installation & Setup ===

# Install all dependencies
install:
    npm install
    cd packages/web-app/frontend && npm install

# Clean all build artifacts and dependencies
clean:
    rm -rf node_modules
    rm -rf packages/*/node_modules
    rm -rf packages/*/dist
    rm -rf packages/web-app/frontend/node_modules
    rm -rf packages/web-app/frontend/dist
    find . -name '*.tsbuildinfo' -delete
    find . -name '.turbo' -type d -exec rm -rf {} + 2>/dev/null || true

# Fresh install - clean and reinstall
fresh: clean install

# === Building ===

# Build all packages
build:
    npm run build

# Build specific package
build-package PACKAGE:
    npm run build -w @supranorma/{{PACKAGE}}

# Build in watch mode
watch:
    npm run dev

# Build web app backend
build-backend:
    npm run build:backend -w @supranorma/web-app

# Build web app frontend
build-frontend:
    npm run build:frontend -w @supranorma/web-app

# Build everything for production
build-prod: clean install build

# === Testing ===

# Run all tests
test:
    npm test

# Run tests in watch mode
test-watch:
    npm run test:watch

# Run tests for specific package
test-package PACKAGE:
    npm test -w @supranorma/{{PACKAGE}}

# Run tests with coverage
test-coverage:
    npm test -- --coverage

# === Code Quality ===

# Run TypeScript type checking
typecheck:
    npm run typecheck

# Run linter
lint:
    npm run lint

# Fix linting issues
lint-fix:
    npm run lint -- --fix

# Format code
format:
    npm run format

# Check code formatting
format-check:
    npm run format -- --check

# Run all quality checks
quality: typecheck lint format-check test

# === Development ===

# Start development server (all services)
dev:
    npm run dev -w @supranorma/web-app

# Start backend only
dev-backend:
    npm run dev:backend -w @supranorma/web-app

# Start frontend only
dev-frontend:
    npm run dev:frontend -w @supranorma/web-app

# Run CLI
cli *ARGS:
    npm run cli -- {{ARGS}}

# Interactive CLI chat
chat:
    npm run cli chat

# Analyze a file
analyze FILE:
    npm run cli analyze {{FILE}}

# Generate code
generate:
    npm run cli generate

# === Git & Version Control ===

# Create conventional commit
commit TYPE SCOPE MESSAGE:
    git add .
    git commit -m "{{TYPE}}({{SCOPE}}): {{MESSAGE}}"

# Create feature commit
feat SCOPE MESSAGE:
    just commit feat {{SCOPE}} "{{MESSAGE}}"

# Create fix commit
fix SCOPE MESSAGE:
    just commit fix {{SCOPE}} "{{MESSAGE}}"

# Create docs commit
docs SCOPE MESSAGE:
    just commit docs {{SCOPE}} "{{MESSAGE}}"

# Show git status
status:
    git status

# === Release Management ===

# Bump version (patch)
version-patch:
    npm version patch --workspaces

# Bump version (minor)
version-minor:
    npm version minor --workspaces

# Bump version (major)
version-major:
    npm version major --workspaces

# Create release tag
tag VERSION:
    git tag -a v{{VERSION}} -m "Release v{{VERSION}}"
    git push origin v{{VERSION}}

# === Database ===

# Initialize database
db-init:
    @echo "Database will be auto-created on first run"

# Reset database (WARNING: destroys data)
db-reset:
    rm -f supranorma.db
    @echo "Database deleted. Will be recreated on next run."

# === Security ===

# Run security audit
audit:
    npm audit

# Fix security vulnerabilities
audit-fix:
    npm audit fix

# === Documentation ===

# Generate API docs
docs-api:
    @echo "API docs are in docs/api/README.md"

# Serve documentation locally
docs-serve:
    @echo "Opening docs in browser..."
    open docs/getting-started.md || xdg-open docs/getting-started.md

# === Deployment ===

# Build for production deployment
deploy-prep: build-prod
    @echo "Production build complete"
    @echo "Backend: packages/web-app/dist/backend/"
    @echo "Frontend: packages/web-app/frontend/dist/"

# Start production server
serve-prod:
    NODE_ENV=production node packages/web-app/dist/backend/server.js

# === Utilities ===

# Show dependency tree
deps:
    npm list --all

# Show outdated dependencies
outdated:
    npm outdated

# Update dependencies
update:
    npm update

# Validate package.json files
validate-pkg:
    @for pkg in packages/*/package.json; do \
        echo "Validating $pkg..."; \
        cat "$pkg" | jq empty || exit 1; \
    done
    @echo "All package.json files are valid"

# === RSR Compliance ===

# Check RSR compliance
rsr-check:
    @echo "=== RSR Compliance Check ==="
    @echo ""
    @echo "Documentation:"
    @test -f README.md && echo "✓ README.md" || echo "✗ README.md"
    @test -f LICENSE.txt && echo "✓ LICENSE.txt" || echo "✗ LICENSE.txt"
    @test -f SECURITY.md && echo "✓ SECURITY.md" || echo "✗ SECURITY.md"
    @test -f CODE_OF_CONDUCT.md && echo "✓ CODE_OF_CONDUCT.md" || echo "✗ CODE_OF_CONDUCT.md"
    @test -f CONTRIBUTING.md && echo "✓ CONTRIBUTING.md (in docs/)" || echo "✗ CONTRIBUTING.md"
    @test -f MAINTAINERS.md && echo "✓ MAINTAINERS.md" || echo "✗ MAINTAINERS.md"
    @test -f CHANGELOG.md && echo "✓ CHANGELOG.md" || echo "✗ CHANGELOG.md"
    @echo ""
    @echo ".well-known/:"
    @test -f .well-known/security.txt && echo "✓ security.txt" || echo "✗ security.txt"
    @test -f .well-known/ai.txt && echo "✓ ai.txt" || echo "✗ ai.txt"
    @test -f .well-known/humans.txt && echo "✓ humans.txt" || echo "✗ humans.txt"
    @echo ""
    @echo "Build System:"
    @test -f justfile && echo "✓ justfile" || echo "✗ justfile"
    @test -f package.json && echo "✓ package.json" || echo "✗ package.json"
    @test -f tsconfig.json && echo "✓ tsconfig.json" || echo "✗ tsconfig.json"
    @echo ""
    @echo "CI/CD:"
    @test -f .github/workflows/ci.yml && echo "✓ CI workflow" || echo "✗ CI workflow"
    @test -f .github/workflows/release.yml && echo "✓ Release workflow" || echo "✗ Release workflow"
    @echo ""
    @echo "Type Safety:"
    @grep -q '"strict": true' tsconfig.json && echo "✓ TypeScript strict mode" || echo "✗ TypeScript strict mode"
    @echo ""
    @echo "Testing:"
    @test -d packages/shared/tests && echo "✓ Test structure" || echo "✗ Test structure"

# Full validation - all checks
validate: quality rsr-check
    @echo ""
    @echo "=== Full Validation Complete ==="

# === Help ===

# Show extended help
help:
    @echo "Supranorma Build System"
    @echo "======================"
    @echo ""
    @echo "Quick Start:"
    @echo "  just install    # Install dependencies"
    @echo "  just build      # Build all packages"
    @echo "  just test       # Run tests"
    @echo "  just dev        # Start development server"
    @echo ""
    @echo "For full command list: just --list"
    @echo ""
    @echo "Documentation: docs/getting-started.md"
    @echo "Contributing: docs/contributing.md"

# === Advanced ===

# Profile build performance
profile:
    npm run build -- --profile

# Analyze bundle size
analyze-bundle:
    cd packages/web-app/frontend && npm run build -- --analyze

# Generate dependency graph
dep-graph:
    npm run dep-graph || echo "Install madge: npm install -g madge"

# Count lines of code
loc:
    @echo "Lines of Code:"
    @find packages -name '*.ts' -o -name '*.tsx' | xargs wc -l | tail -1

# Show TODO comments
todos:
    @echo "TODO items:"
    @grep -r "TODO" packages --include="*.ts" --include="*.tsx" || echo "No TODOs found!"

# === Environment ===

# Setup environment file
env-setup:
    @test -f .env || cp .env.example .env
    @echo ".env file ready for configuration"

# Validate environment
env-check:
    @test -f .env && echo "✓ .env file exists" || echo "✗ .env file missing"
    @grep -q "ANTHROPIC_API_KEY" .env && echo "  Contains ANTHROPIC_API_KEY" || echo "  Missing ANTHROPIC_API_KEY"
