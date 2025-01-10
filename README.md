# dotcursor

This project helps you create the .cursorignore and other files that .cursorrules will refer to.

## Features

- Generates `.cursor.directory_structure.md` with detailed project information
- Directory hierarchy visualization
- File descriptions and types
- Function listings with detailed descriptions
- File size alerts based on language standards

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
dotcursor
```

This will generate a `.cursor.directory_structure.md` file in the current directory with:

- Complete directory hierarchy
- File types and sizes
- Function listings (for supported languages)
- Size alerts for files exceeding language-specific recommendations
