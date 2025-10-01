# API Documentation

This document provides comprehensive documentation for the lcoview API.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Functions](#core-functions)
- [Type Definitions](#type-definitions)
- [Examples](#examples)

## Installation

```bash
bun add lcoview
# or
npm install lcoview
```

## Quick Start

```typescript
import { generateReport } from 'lcoview'

// Generate HTML coverage report
await generateReport('coverage/lcov.info', {
  sourceDir: './src',
  outputDir: './coverage-report',
  open: true
})
```

## Core Functions

### `generateReport(lcovPath, options?)`

Generates an interactive HTML coverage report from an LCOV file.

**Parameters:**
- `lcovPath: string` - Path to the lcov.info file
- `options?: GenerateReportOptions` - Optional configuration

**Returns:** `Promise<void>`

**Options:**
```typescript
interface GenerateReportOptions {
  sourceDir?: string    // Base directory for source files
  outputDir?: string    // Output directory for HTML report (default: coverage-html)
  open?: boolean        // Open report in browser after generation (default: false)
}
```

**Example:**
```typescript
import { generateReport } from 'lcoview'

// Basic usage
await generateReport('coverage/lcov.info')

// With options
await generateReport('coverage/lcov.info', {
  sourceDir: './src',
  outputDir: './coverage-report',
  open: true
})
```

## Classes

### `LcovParser`

Parses LCOV format files into structured coverage data.

**Methods:**

#### `parse(content: string): CoverageReport`

Parses LCOV content and returns structured coverage data.

**Example:**
```typescript
import { LcovParser } from 'lcoview'
import { readFileSync } from 'fs'

const parser = new LcovParser()
const content = readFileSync('coverage/lcov.info', 'utf-8')
const report = parser.parse(content)

console.log(`Total files: ${report.files.length}`)
console.log(`Line coverage: ${report.summary.lines.percentage.toFixed(2)}%`)
```

### `HtmlGenerator`

Generates HTML coverage reports from parsed coverage data.

**Constructor:**
```typescript
constructor(report: CoverageReport, sourceDir?: string)
```

**Methods:**

#### `generate(outputDir: string): Promise<void>`

Generates complete HTML report with index and individual file pages.

**Example:**
```typescript
import { LcovParser, HtmlGenerator } from 'lcoview'
import { readFileSync } from 'fs'

const parser = new LcovParser()
const content = readFileSync('coverage/lcov.info', 'utf-8')
const report = parser.parse(content)

const generator = new HtmlGenerator(report, './src')
await generator.generate('./coverage-report')
```

## Type Definitions

### `CoverageReport`

The main coverage report structure:

```typescript
interface CoverageReport {
  files: FileCoverage[]
  summary: CoverageSummary
}
```

### `FileCoverage`

Coverage data for a single file:

```typescript
interface FileCoverage {
  path: string
  lines: {
    found: number
    hit: number
    details: LineDetail[]
  }
  functions: {
    found: number
    hit: number
    details: FunctionDetail[]
  }
  branches: {
    found: number
    hit: number
    details: BranchDetail[]
  }
}
```

### `CoverageSummary`

Summary statistics across all files:

```typescript
interface CoverageSummary {
  lines: {
    total: number
    covered: number
    percentage: number
  }
  functions: {
    total: number
    covered: number
    percentage: number
  }
  branches: {
    total: number
    covered: number
    percentage: number
  }
}
```

### `LineDetail`

Details for a single line of code:

```typescript
interface LineDetail {
  lineNumber: number
  executionCount: number
}
```

### `FunctionDetail`

Details for a single function:

```typescript
interface FunctionDetail {
  name: string
  lineNumber: number
  executionCount: number
}
```

### `BranchDetail`

Details for a single branch:

```typescript
interface BranchDetail {
  lineNumber: number
  blockNumber: number
  branchNumber: number
  taken: number
}
```

## Examples

### Basic Report Generation

```typescript
import { generateReport } from 'lcoview'

// Generate report after running tests
await generateReport('coverage/lcov.info', {
  outputDir: './coverage-report',
  open: true
})
```

### Custom Processing

```typescript
import { LcovParser, HtmlGenerator } from 'lcoview'
import { readFileSync } from 'fs'

const parser = new LcovParser()
const content = readFileSync('coverage/lcov.info', 'utf-8')
const report = parser.parse(content)

// Analyze coverage
const lowCoverageFiles = report.files.filter(file => {
  const percentage = (file.lines.hit / file.lines.found) * 100
  return percentage < 80
})

console.log('Files with <80% coverage:')
lowCoverageFiles.forEach(file => {
  const percentage = ((file.lines.hit / file.lines.found) * 100).toFixed(2)
  console.log(`  ${file.path}: ${percentage}%`)
})

// Generate HTML report
const generator = new HtmlGenerator(report, './src')
await generator.generate('./coverage-report')
```

### Programmatic Analysis

```typescript
import { LcovParser } from 'lcoview'
import { readFileSync } from 'fs'

const parser = new LcovParser()
const content = readFileSync('coverage/lcov.info', 'utf-8')
const report = parser.parse(content)

// Calculate coverage statistics
const stats = {
  totalFiles: report.files.length,
  totalLines: report.summary.lines.total,
  coveredLines: report.summary.lines.covered,
  lineCoverage: report.summary.lines.percentage,
  functionCoverage: report.summary.functions.percentage,
  branchCoverage: report.summary.branches.percentage
}

console.log('Coverage Statistics:')
console.log(`  Files: ${stats.totalFiles}`)
console.log(`  Lines: ${stats.coveredLines}/${stats.totalLines} (${stats.lineCoverage.toFixed(2)}%)`)
console.log(`  Functions: ${stats.functionCoverage.toFixed(2)}%`)
console.log(`  Branches: ${stats.branchCoverage.toFixed(2)}%`)
```

### Integration with Test Runners

```typescript
import { generateReport } from 'lcoview'
import { spawnSync } from 'child_process'

// Run tests with coverage
const result = spawnSync('bun', ['test', '--coverage', '--coverage-reporter=lcov'], {
  stdio: 'inherit'
})

if (result.status === 0) {
  // Tests passed, generate HTML report
  await generateReport('coverage/lcov.info', {
    sourceDir: './src',
    outputDir: './coverage-report',
    open: process.env.CI !== 'true' // Don't open in CI
  })
  console.log('Coverage report generated!')
} else {
  console.error('Tests failed')
  process.exit(1)
}
```

### Custom Report Styling

```typescript
import { LcovParser, HtmlGenerator } from 'lcoview'
import { readFileSync, writeFileSync } from 'fs'

const parser = new LcovParser()
const content = readFileSync('coverage/lcov.info', 'utf-8')
const report = parser.parse(content)

const generator = new HtmlGenerator(report, './src')
await generator.generate('./coverage-report')

// Add custom CSS
const customCSS = `
  body { font-family: 'Monaco', monospace; }
  .high { background-color: #d4edda; }
  .low { background-color: #f8d7da; }
`

const cssPath = './coverage-report/custom.css'
writeFileSync(cssPath, customCSS)

console.log('Custom styling applied!')
```
