# .cursorrules Templates

This directory contains template configurations for `.cursorrules` files. The `.cursorrules` file is used to configure Cursor IDE behavior for your project.

## Usage

1. Use Claude Sonnet to generate a custom .cursorrules file by providing relevant templates from this directory as context
2. Review and adjust the generated configuration to match your project's needs
3. Save the file as `.cursorrules` in your project root

## Common Configuration

These configurations are recommended for all projects:

```yaml
# Search paths for code navigation
# Customize these paths based on your project structure
search_path:
  - src/**/*
  - .github/**/*.yml

file_associations:
  "*.ts": "typescript"
  "*.js": "javascript"
  "*.py": "python"
  "*.html": "html"
  # Add more as needed

# Directory structure tracking
track_file_structure: true
structure_file: ".cursor.directory_structure.md"

# README feature list tracking
track_readme_features: true
readme_file: "README.md"
feature_section: "## Features"

# Git commit message configuration
git:
  commit_types:
    - type: "feat"
      description: "A new feature"
    - type: "fix"
      description: "A bug fix"
    - type: "docs"
      description: "Documentation only changes"
    - type: "style"
      description: "Changes that do not affect the meaning of the code"
    - type: "refactor"
      description: "A code change that neither fixes a bug nor adds a feature"
    - type: "perf"
      description: "A code change that improves performance"
    - type: "test"
      description: "Adding missing or correcting existing tests"
    - type: "chore"
      description: "Changes to build process or auxiliary tools"
```

## Project-Specific Templates

Templates in this directory only contain configurations specific to their project type. Combine them with the common configuration above.

### Available Templates

1. `typescript-node.cursorrules` - TypeScript Node.js specific configurations
2. `python-flask.cursorrules` - Python Flask specific configurations

## Contributing

Feel free to contribute new templates or improvements to existing ones by submitting a pull request.
