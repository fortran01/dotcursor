# dotcursor

This project helps you create the files that .cursorrules will refer to.

## Features

- Generates `.cursor.directory_structure.md` with detailed project information
- Directory hierarchy visualization
- File descriptions and types
- Function listings with detailed descriptions
- File size alerts based on language standards
- Continuous monitoring mode to automatically update documentation on file changes

## Installation

```bash
# Install dependencies
bun install

# Make the command globally available
bun link
```

## Usage

Navigate to any directory and run:

```bash
# Generate documentation once
dotcursor

# Run in watch mode to automatically update on changes
dotcursor --watch
# or
dotcursor -w
```

This will generate a `.cursor.directory_structure.md` file in the current directory with:

- Complete directory hierarchy
- File types and sizes
- Function listings (for supported languages)
- Size alerts for files exceeding language-specific recommendations

When running in watch mode, the documentation will automatically update whenever files are added, modified, or deleted in the directory.
