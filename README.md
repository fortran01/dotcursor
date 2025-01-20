# dotcursor

This project helps you create the files that .cursorrules will refer to.

## Tech Stack

- TypeScript for type-safe development
- Bun as the JavaScript runtime and package manager
- Command-line interface (CLI) application architecture

## Features

- Generates `.cursor.directory_structure.md` with detailed project information
- Directory hierarchy visualization
- File descriptions and types
- Function listings with detailed descriptions
- File size alerts based on language standards
- Continuous monitoring mode to automatically update documentation on file changes
- Flexible directory exclusion with multiple `--exclude` flags support
- Automatic respect for `.gitignore` patterns to exclude ignored files and directories

## Release Strategy

The project uses automated versioning and publishing through GitHub Actions. Here's how it works:

- **Automatic Version Bumping**: Version is automatically incremented based on commit messages:
  - `fix:` or regular commits → Patch version (0.0.x)
  - `feat:` → Minor version (0.x.0)
  - `BREAKING CHANGE:` in commit body → Major version (x.0.0)

- **Release Process**: When code is pushed to main branch:
  1. Tests are run
  2. Version is bumped
  3. GitHub release is created
  4. Package is published to npm

- **Manual Release**: Can be triggered via GitHub Actions workflow_dispatch

## Installation

```bash
# Install dependencies
bun install

# Make the command globally available
bun link
```

## Testing Locally

```bash
# Build the project
bun run build

# Run tests
bun test

# Test global installation
npm uninstall -g dotcursor  # Remove any existing installation
npm install -g .           # Install from local directory

# Test the command
dotcursor --help
```

## Docker Testing

```bash
# Build and run tests in Docker
docker build -t dotcursor-test -f Dockerfile.test . && docker run --rm dotcursor-test
```

This will:

- Create a clean Debian environment
- Install Node.js and required dependencies
- Install dotcursor from npm
- Run integration tests to verify:
  - Global installation works
  - Command is accessible
  - File generation works correctly
  - Gitignore patterns are respected

## Usage

Navigate to any directory and run:

```bash
# Generate documentation once
dotcursor

# Run in watch mode to automatically update on changes
dotcursor --watch
# or
dotcursor -w

# Exclude specific directories
dotcursor --exclude test
# Multiple directories can be excluded using multiple flags
dotcursor --exclude test --exclude docs --exclude examples

# Combine with watch mode
dotcursor --watch --exclude test --exclude docs
```

This will generate a `.cursor.directory_structure.md` file in the current directory with:

- Complete directory hierarchy
- File types and sizes
- Function listings (for supported languages)
- Size alerts for files exceeding language-specific recommendations

When running in watch mode, the documentation will automatically update whenever files are added, modified, or deleted in the directory.
