# CLI Documentation

This document provides comprehensive documentation for the lcoview command-line interface.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Command](#command)
- [Options](#options)
- [Examples](#examples)
- [Configuration](#configuration)

## Installation

```bash
# Install globally
bun add -g lcoview
# or
npm install -g lcoview

# Or run directly with bunx/npx
bunx lcoview --help
npx lcoview --help
```

## Quick Start

```bash
# Generate HTML coverage report
lcoview coverage/lcov.info

# With custom options
lcoview coverage/lcov.info -s ./src -d ./coverage-report -o
```

## Command

### `lcoview <filepath>`

Generates an interactive HTML coverage report from an LCOV file.

**Syntax:**
```bash
lcoview <filepath> [options]
```

**Arguments:**
- `filepath` - Path to the lcov.info file (required)

**Options:**
- `-s, --source-dir <dir>` - Base directory for source files
- `-d, --dest-dir <dir>` - Output directory for HTML report (default: coverage-html)
- `-o, --open` - Open report in browser after generation
- `-q, --quiet` - Suppress all output except errors
- `-h, --help` - Show help information
- `-V, --version` - Show version number

## Options

### `-s, --source-dir <dir>`

Specifies the base directory containing the source files referenced in the LCOV file.

**Default:** Current working directory

**Example:**
```bash
lcoview coverage/lcov.info --source-dir ./src
```

### `-d, --dest-dir <dir>`

Specifies the output directory where the HTML report will be generated.

**Default:** `coverage-html`

**Example:**
```bash
lcoview coverage/lcov.info --dest-dir ./coverage-report
```

### `-o, --open`

Automatically opens the generated coverage report in the default web browser.

**Example:**
```bash
lcoview coverage/lcov.info --open
```

### `-q, --quiet`

Suppresses all console output except errors. Useful for CI/CD pipelines.

**Example:**
```bash
lcoview coverage/lcov.info --quiet
```

### `-h, --help`

Shows help information including available options and usage examples.

**Example:**
```bash
lcoview --help
```

### `-V, --version`

Displays the current version of lcoview.

**Example:**
```bash
lcoview --version
```

## Examples

### Basic Usage

```bash
# Generate report from default LCOV file
lcoview coverage/lcov.info
```

### Custom Output Directory

```bash
# Generate report in custom directory
lcoview coverage/lcov.info -d ./public/coverage
```

### With Source Directory

```bash
# Specify source directory for better file resolution
lcoview coverage/lcov.info -s ./src -d ./coverage-report
```

### Open in Browser

```bash
# Generate and open report automatically
lcoview coverage/lcov.info -o
```

### Combined Options

```bash
# All options together
lcoview coverage/lcov.info -s ./src -d ./coverage-report -o
```

### Silent Mode for CI

```bash
# Run silently in CI environment
lcoview coverage/lcov.info --quiet
```

## Integration with Test Runners

### Bun

```bash
# Run tests with coverage and generate HTML report
bun test --coverage --coverage-reporter=lcov && lcoview coverage/lcov.info -o
```

**package.json scripts:**
```json
{
  "scripts": {
    "test": "bun test",
    "test:coverage": "bun test --coverage --coverage-reporter=lcov",
    "coverage:html": "lcoview coverage/lcov.info -o",
    "coverage:report": "bun run test:coverage && bun run coverage:html"
  }
}
```

### Jest

```bash
# Generate LCOV report with Jest
jest --coverage --coverageReporters=lcov && lcoview coverage/lcov.info -o
```

**package.json scripts:**
```json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage --coverageReporters=lcov",
    "coverage:html": "lcoview coverage/lcov.info -s ./src -o",
    "coverage:report": "npm run test:coverage && npm run coverage:html"
  }
}
```

### Vitest

```bash
# Generate LCOV report with Vitest
vitest run --coverage --reporter=lcov && lcoview coverage/lcov.info -o
```

**package.json scripts:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest run --coverage --reporter=lcov",
    "coverage:html": "lcoview coverage/lcov.info -s ./src -o",
    "coverage:report": "npm run test:coverage && npm run coverage:html"
  }
}
```

## Scripting Examples

### Basic Coverage Script

```bash
#!/bin/bash

# Run tests and generate coverage report
bun test --coverage --coverage-reporter=lcov

# Check if tests passed
if [ $? -eq 0 ]; then
  echo "Tests passed! Generating HTML report..."
  lcoview coverage/lcov.info -s ./src -d ./coverage-report -o
  echo "Coverage report generated successfully!"
else
  echo "Tests failed!"
  exit 1
fi
```

### CI/CD Pipeline Script

```bash
#!/bin/bash

# CI script for generating coverage reports
set -e

echo "Running tests with coverage..."
bun test --coverage --coverage-reporter=lcov

echo "Generating HTML coverage report..."
lcoview coverage/lcov.info -s ./src -d ./public/coverage --quiet

echo "Coverage report available at ./public/coverage/index.html"
```

### Git Hook (pre-push)

```bash
#!/bin/bash

# Pre-push hook to check coverage
echo "Checking test coverage..."

bun test --coverage --coverage-reporter=lcov --quiet

if [ $? -eq 0 ]; then
  lcoview coverage/lcov.info -s ./src -d ./coverage-report --quiet
  echo "✓ Coverage report generated"
else
  echo "✗ Tests failed"
  exit 1
fi
```

## Configuration

### Environment Variables

You can use environment variables to set default options:

- `LCOVIEW_SOURCE_DIR` - Default source directory
- `LCOVIEW_DEST_DIR` - Default output directory
- `LCOVIEW_OPEN` - Auto-open browser (set to "true" to enable)
- `LCOVIEW_QUIET` - Quiet mode (set to "true" to enable)

**Example:**
```bash
# Set environment variables
export LCOVIEW_SOURCE_DIR=./src
export LCOVIEW_DEST_DIR=./coverage-report
export LCOVIEW_OPEN=true

# Now you can run with fewer options
lcoview coverage/lcov.info
```

### Exit Codes

The CLI uses standard exit codes:

- `0` - Success
- `1` - General error
- `2` - LCOV file not found
- `3` - Parse error
- `4` - File write error

**Example:**
```bash
# Check exit code in scripts
lcoview coverage/lcov.info
if [ $? -eq 0 ]; then
  echo "Report generated successfully"
else
  echo "Failed to generate report"
  exit 1
fi
```

## Output Format

### Console Output

```
Parsing LCOV file: coverage/lcov.info
Generating HTML report...
  ✓ Index page generated
  ✓ 42 file pages generated
Report generated at: coverage-html/
Opening report in browser...
```

### Quiet Mode Output

```
# No output unless error occurs
```

### Error Output

```
Error: LCOV file not found: coverage/lcov.info
```

## Troubleshooting

### Common Issues

**LCOV file not found:**
```bash
# Check if file exists
ls -la coverage/lcov.info

# Run tests to generate LCOV file first
bun test --coverage --coverage-reporter=lcov
```

**Source files not displayed:**
```bash
# Specify correct source directory
lcoview coverage/lcov.info --source-dir ./src
```

**Permission errors:**
```bash
# Check write permissions on output directory
mkdir -p coverage-html
chmod -R 755 coverage-html

# Then generate report
lcoview coverage/lcov.info -d coverage-html
```

**Browser doesn't open:**
```bash
# Open manually
open coverage-html/index.html  # macOS
xdg-open coverage-html/index.html  # Linux
start coverage-html/index.html  # Windows
```

## Performance Tips

1. **Use quiet mode in CI/CD** to reduce log noise
2. **Specify source directory** for faster file resolution
3. **Clean old reports** before generating new ones
4. **Use relative paths** when possible

## Best Practices

1. **Add to .gitignore:**
   ```gitignore
   coverage/
   coverage-html/
   coverage-report/
   ```

2. **Use npm scripts** for consistency:
   ```json
   {
     "scripts": {
       "test": "bun test",
       "test:coverage": "bun test --coverage --coverage-reporter=lcov",
       "coverage:html": "lcoview coverage/lcov.info -s ./src -o"
     }
   }
   ```

3. **Document coverage commands** in your README

4. **Set coverage thresholds** in your test configuration
