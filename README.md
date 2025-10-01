# lcoview

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A fast, lightweight LCOV coverage report viewer that generates beautiful, interactive HTML reports with file filtering.

## Features

- 🚀 **Fast Generation** - Quickly converts LCOV files to interactive HTML reports
- 🔍 **File Filtering** - Search and filter coverage results by file path
- 🎨 **Beautiful UI** - Clean, modern interface with color-coded coverage indicators
- 📊 **Detailed Metrics** - Line, function, and branch coverage at a glance
- 🔬 **Source Code View** - View source code with line-by-line coverage highlighting
- 🌐 **Auto-Open Browser** - Optional browser auto-launch after generation
- 📦 **Zero Dependencies** - Generates self-contained HTML with inline CSS/JS
- ⚡ **Bun-Powered** - Built with Bun for maximum performance

## Quick Start

### Installation

```bash
# Using Bun (recommended)
bun add -g lcoview

# Using npm
npm install -g lcoview
```

### Basic Usage

```bash
# Generate coverage report
lcoview coverage/lcov.info

# Specify source directory
lcoview coverage/lcov.info -s ./src

# Generate to custom directory and open browser
lcoview coverage/lcov.info -d ./coverage-report -o

# Quiet mode (suppress output)
lcoview coverage/lcov.info -q
```

## CLI Options

```
Usage: lcoview [options] <lcov-file>

Arguments:
  lcov-file                  Path to lcov.info file

Options:
  -V, --version              output the version number
  -s, --source-dir <path>    Source directory for files referenced in lcov.info (default: current directory)
  -d, --dest-dir <path>      Output directory for HTML report (default: temp folder)
  -o, --open                 Open browser to index.html after generation
  -q, --quiet                Suppress output
  -h, --help                 display help for command
```

## Usage Examples

### Generate Report from Test Coverage

```bash
# Run tests with coverage
bun test --coverage --coverage-reporter=lcov

# Generate HTML report
lcoview coverage/lcov.info -s . -d coverage/html -o
```

### CI/CD Integration

```bash
# Generate report in CI without opening browser
lcoview coverage/lcov.info -d coverage-report -q

# The report will be available at coverage-report/index.html
```

### Programmatic Usage

```typescript
import { generateReport } from 'lcoview'

const indexPath = await generateReport({
  lcovFilePath: 'coverage/lcov.info',
  sourceDir: './src',
  destDir: './coverage-html',
  quiet: false
})

console.log(`Report generated at: ${indexPath}`)
```

## Report Features

### Index Page
- **Overall Summary**: Aggregated coverage statistics for lines, functions, and branches
- **File List**: Complete list of all files with individual coverage percentages
- **Search/Filter**: Real-time filtering by file path
- **Color Coding**:
  - 🟢 Green (≥80%): High coverage
  - 🟡 Orange (50-79%): Medium coverage
  - 🔴 Red (<50%): Low coverage

### File Detail Pages
- **Source Code View**: Full source code with syntax highlighting
- **Line-by-Line Coverage**:
  - Green background: Line executed
  - Red background: Line not executed
  - White background: Non-executable line
- **Execution Counts**: Number of times each line was executed
- **Breadcrumb Navigation**: Easy navigation back to index

## Development

### Requirements

- Node.js ≥22.0.0
- Bun ≥1.0.0 (recommended)

### Setup

```bash
# Clone repository
git clone https://github.com/hiddentao/lcoview.git
cd lcoview

# Install dependencies
bun install

# Build project
bun run build

# Run tests
bun test

# Run tests with coverage
bun test --coverage --coverage-reporter=lcov

# Generate lcoview's own coverage report!
./bin/lcoview.js coverage/lcov.info -s . -d coverage/html-report -o
```

## LCOV Format Support

lcoview supports standard LCOV format including:

- `SF:` - Source file
- `FN:` - Function definition
- `FNDA:` - Function data (execution count)
- `FNF/FNH` - Functions found/hit
- `DA:` - Line data (execution count)
- `LF/LH` - Lines found/hit
- `BRDA:` - Branch data
- `BRF/BRH` - Branches found/hit

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE.md](LICENSE.md) for details.

