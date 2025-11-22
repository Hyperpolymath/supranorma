{
  description = "Supranorma - AI-Powered Development Tools Monorepo";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        # Node.js version - ensure consistency
        nodejs = pkgs.nodejs_20;

        # npm with specific node version
        npm = pkgs.nodePackages.npm.override { inherit nodejs; };

        # Development tools
        devTools = with pkgs; [
          nodejs
          npm
          just        # Build automation
          git         # Version control
          sqlite      # Database

          # TypeScript tooling
          nodePackages.typescript
          nodePackages.typescript-language-server

          # Code quality
          nodePackages.eslint
          nodePackages.prettier

          # Utilities
          jq          # JSON processing
          curl        # HTTP requests
          wget        # Downloads
          ripgrep     # Fast grep
          fd          # Fast find
        ];

        # Build inputs for native dependencies
        buildInputs = with pkgs; [
          nodePackages.node-gyp
          python3     # For node-gyp
          pkg-config  # For native modules
          sqlite      # For better-sqlite3
        ] ++ lib.optionals stdenv.isDarwin [
          darwin.apple_sdk.frameworks.CoreServices
        ] ++ lib.optionals stdenv.isLinux [
          stdenv.cc.cc.lib
        ];

      in
      {
        # Development shell
        devShells.default = pkgs.mkShell {
          name = "supranorma-dev";

          buildInputs = devTools ++ buildInputs;

          shellHook = ''
            echo "🚀 Supranorma Development Environment"
            echo "====================================="
            echo ""
            echo "Node.js: $(node --version)"
            echo "npm: $(npm --version)"
            echo "Just: $(just --version)"
            echo ""
            echo "Available commands:"
            echo "  just install    # Install dependencies"
            echo "  just build      # Build all packages"
            echo "  just test       # Run tests"
            echo "  just dev        # Start development"
            echo "  just --list     # Show all commands"
            echo ""
            echo "Documentation: docs/getting-started.md"
            echo ""

            # Set up environment variables
            export NODE_ENV=development
            export PATH="$PWD/node_modules/.bin:$PATH"

            # Create .env if it doesn't exist
            if [ ! -f .env ]; then
              echo "📝 Creating .env file..."
              cat > .env << 'EOF'
# Supranorma Configuration
# Copy this to .env and fill in your values

# AI Provider (anthropic or openai)
SUPRANORMA_LLM_PROVIDER=anthropic

# API Keys (set one based on provider)
ANTHROPIC_API_KEY=
# OPENAI_API_KEY=

# Optional Configuration
# SUPRANORMA_LLM_MODEL=claude-3-5-sonnet-20241022
# SUPRANORMA_LLM_MAX_TOKENS=4096
# SUPRANORMA_LLM_TEMPERATURE=0.7

# Web App Configuration
# PORT=3000
# JWT_SECRET=your-secret-key-change-in-production
# CORS_ORIGIN=http://localhost:5173
EOF
              echo "✓ Created .env file - please configure your API keys"
              echo ""
            fi
          '';

          # Environment variables for build
          NIX_CFLAGS_COMPILE = toString (
            pkgs.lib.optionals pkgs.stdenv.isDarwin [
              "-I${pkgs.darwin.apple_sdk.frameworks.CoreServices}/Library/Frameworks/CoreServices.framework/Headers"
            ]
          );
        };

        # Production build package
        packages.default = pkgs.buildNpmPackage rec {
          pname = "supranorma";
          version = "0.1.0";

          src = ./.;

          # Use specific node version
          nativeBuildInputs = [ nodejs npm ] ++ buildInputs;

          # npm dependencies hash (update this when dependencies change)
          # Run: nix-prefetch-url --unpack https://registry.npmjs.org/package/-/package-version.tgz
          npmDepsHash = "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";

          # Skip npm ci during build phase
          npmBuildScript = "build";

          # Install phase
          installPhase = ''
            runHook preInstall

            mkdir -p $out
            cp -r node_modules $out/
            cp -r packages $out/
            cp -r docs $out/
            cp -r examples $out/
            cp package.json $out/
            cp README.md $out/
            cp LICENSE.txt $out/

            runHook postInstall
          '';

          meta = with pkgs.lib; {
            description = "AI-powered development tools monorepo";
            homepage = "https://github.com/Hyperpolymath/supranorma";
            license = licenses.mit;
            maintainers = [ ];
            platforms = platforms.all;
          };
        };

        # Individual package apps
        apps = {
          # CLI application
          cli = {
            type = "app";
            program = "${pkgs.writeShellScript "supranorma-cli" ''
              #!/usr/bin/env bash
              cd ${self.packages.${system}.default}
              ${nodejs}/bin/node packages/cli/dist/index.js "$@"
            ''}";
          };

          # Web app backend
          backend = {
            type = "app";
            program = "${pkgs.writeShellScript "supranorma-backend" ''
              #!/usr/bin/env bash
              cd ${self.packages.${system}.default}
              ${nodejs}/bin/node packages/web-app/dist/backend/server.js
            ''}";
          };
        };

        # Checks for CI/CD
        checks = {
          # Type checking
          typecheck = pkgs.runCommand "typecheck" {
            buildInputs = [ nodejs npm ];
          } ''
            cd ${self}
            npm ci
            npm run typecheck
            touch $out
          '';

          # Linting
          lint = pkgs.runCommand "lint" {
            buildInputs = [ nodejs npm ];
          } ''
            cd ${self}
            npm ci
            npm run lint
            touch $out
          '';

          # Formatting check
          format = pkgs.runCommand "format-check" {
            buildInputs = [ nodejs npm ];
          } ''
            cd ${self}
            npm ci
            npm run format -- --check
            touch $out
          '';

          # Tests
          test = pkgs.runCommand "test" {
            buildInputs = [ nodejs npm sqlite ];
          } ''
            cd ${self}
            npm ci
            npm test
            touch $out
          '';

          # RSR compliance
          rsr-compliance = pkgs.runCommand "rsr-compliance" {
            buildInputs = [ just ];
          } ''
            cd ${self}
            just rsr-check
            touch $out
          '';
        };
      }
    );

  # Metadata
  nixConfig = {
    extra-substituters = [
      "https://cache.nixos.org"
    ];
    extra-trusted-public-keys = [
      "cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY="
    ];
  };
}
