# Type Definitions

This document provides comprehensive documentation for all TypeScript types and interfaces used in lcoview.

## Table of Contents

- [Core Types](#core-types)
- [Coverage Types](#coverage-types)
- [Option Types](#option-types)
- [Detail Types](#detail-types)
- [Utility Types](#utility-types)

## Core Types

### `CoverageReport`

The primary coverage report structure containing all coverage data.

```typescript
interface CoverageReport {
  files: FileCoverage[]
  summary: CoverageSummary
}
```

**Properties:**
- `files` - Array of coverage data for each file
- `summary` - Aggregated coverage statistics across all files

**Example:**
```typescript
const report: CoverageReport = {
  files: [
    {
      path: "src/index.ts",
      lines: { found: 100, hit: 95, details: [...] },
      functions: { found: 10, hit: 10, details: [...] },
      branches: { found: 20, hit: 18, details: [...] }
    }
  ],
  summary: {
    lines: { total: 100, covered: 95, percentage: 95.0 },
    functions: { total: 10, covered: 10, percentage: 100.0 },
    branches: { total: 20, covered: 18, percentage: 90.0 }
  }
}
```

### `FileCoverage`

Coverage data for a single source file.

```typescript
interface FileCoverage {
  path: string
  lines: LineCoverage
  functions: FunctionCoverage
  branches: BranchCoverage
}
```

**Properties:**
- `path` - Relative or absolute path to the source file
- `lines` - Line coverage data
- `functions` - Function coverage data
- `branches` - Branch coverage data

**Example:**
```typescript
const fileCoverage: FileCoverage = {
  path: "src/utils/format.ts",
  lines: {
    found: 25,
    hit: 22,
    details: [
      { lineNumber: 1, executionCount: 10 },
      { lineNumber: 2, executionCount: 0 },
      // ...
    ]
  },
  functions: {
    found: 3,
    hit: 3,
    details: [
      { name: "formatPercentage", lineNumber: 5, executionCount: 15 },
      { name: "pluralize", lineNumber: 12, executionCount: 8 }
    ]
  },
  branches: {
    found: 6,
    hit: 5,
    details: [
      { lineNumber: 10, blockNumber: 0, branchNumber: 0, taken: 5 },
      { lineNumber: 10, blockNumber: 0, branchNumber: 1, taken: 0 }
    ]
  }
}
```

### `CoverageSummary`

Aggregated coverage statistics across all files.

```typescript
interface CoverageSummary {
  lines: CoverageStats
  functions: CoverageStats
  branches: CoverageStats
}
```

**Properties:**
- `lines` - Aggregate line coverage statistics
- `functions` - Aggregate function coverage statistics
- `branches` - Aggregate branch coverage statistics

**Example:**
```typescript
const summary: CoverageSummary = {
  lines: { total: 1000, covered: 850, percentage: 85.0 },
  functions: { total: 100, covered: 92, percentage: 92.0 },
  branches: { total: 200, covered: 175, percentage: 87.5 }
}
```

## Coverage Types

### `LineCoverage`

Line coverage data for a file.

```typescript
interface LineCoverage {
  found: number
  hit: number
  details: LineDetail[]
}
```

**Properties:**
- `found` - Total number of executable lines
- `hit` - Number of lines that were executed
- `details` - Array of line-by-line execution data

### `FunctionCoverage`

Function coverage data for a file.

```typescript
interface FunctionCoverage {
  found: number
  hit: number
  details: FunctionDetail[]
}
```

**Properties:**
- `found` - Total number of functions
- `hit` - Number of functions that were executed
- `details` - Array of function execution data

### `BranchCoverage`

Branch coverage data for a file.

```typescript
interface BranchCoverage {
  found: number
  hit: number
  details: BranchDetail[]
}
```

**Properties:**
- `found` - Total number of branches
- `hit` - Number of branches that were taken
- `details` - Array of branch execution data

### `CoverageStats`

Aggregated coverage statistics.

```typescript
interface CoverageStats {
  total: number
  covered: number
  percentage: number
}
```

**Properties:**
- `total` - Total number of items (lines/functions/branches)
- `covered` - Number of items that were executed/taken
- `percentage` - Coverage percentage (0-100)

**Example:**
```typescript
const stats: CoverageStats = {
  total: 500,
  covered: 425,
  percentage: 85.0
}
```

## Detail Types

### `LineDetail`

Execution data for a single line of code.

```typescript
interface LineDetail {
  lineNumber: number
  executionCount: number
}
```

**Properties:**
- `lineNumber` - Line number in the source file (1-indexed)
- `executionCount` - Number of times this line was executed

**Example:**
```typescript
const lineDetail: LineDetail = {
  lineNumber: 42,
  executionCount: 15
}

// Uncovered line
const uncoveredLine: LineDetail = {
  lineNumber: 100,
  executionCount: 0
}
```

### `FunctionDetail`

Execution data for a single function.

```typescript
interface FunctionDetail {
  name: string
  lineNumber: number
  executionCount: number
}
```

**Properties:**
- `name` - Function name
- `lineNumber` - Line number where the function is defined
- `executionCount` - Number of times this function was called

**Example:**
```typescript
const functionDetail: FunctionDetail = {
  name: "calculateTotal",
  lineNumber: 25,
  executionCount: 42
}

// Uncovered function
const uncoveredFunction: FunctionDetail = {
  name: "legacyHandler",
  lineNumber: 150,
  executionCount: 0
}
```

### `BranchDetail`

Execution data for a single branch.

```typescript
interface BranchDetail {
  lineNumber: number
  blockNumber: number
  branchNumber: number
  taken: number
}
```

**Properties:**
- `lineNumber` - Line number containing the branch
- `blockNumber` - Block identifier
- `branchNumber` - Branch identifier within the block
- `taken` - Number of times this branch was taken (0 = not covered)

**Example:**
```typescript
const branchDetail: BranchDetail = {
  lineNumber: 50,
  blockNumber: 0,
  branchNumber: 0,
  taken: 10
}

// Untaken branch
const untakenBranch: BranchDetail = {
  lineNumber: 50,
  blockNumber: 0,
  branchNumber: 1,
  taken: 0
}
```

## Option Types

### `GenerateReportOptions`

Configuration options for generating coverage reports.

```typescript
interface GenerateReportOptions {
  sourceDir?: string
  outputDir?: string
  open?: boolean
}
```

**Properties:**
- `sourceDir` - Base directory for source files (default: current working directory)
- `outputDir` - Output directory for HTML report (default: "coverage-html")
- `open` - Open report in browser after generation (default: false)

**Example:**
```typescript
const options: GenerateReportOptions = {
  sourceDir: "./src",
  outputDir: "./coverage-report",
  open: true
}
```

## Utility Types

### Type Guards

Helper functions to check types at runtime:

```typescript
// Check if coverage data is valid
function isValidCoverageReport(obj: unknown): obj is CoverageReport {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'files' in obj &&
    'summary' in obj &&
    Array.isArray((obj as any).files)
  )
}

// Check if file coverage is valid
function isValidFileCoverage(obj: unknown): obj is FileCoverage {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'path' in obj &&
    'lines' in obj &&
    'functions' in obj &&
    'branches' in obj
  )
}
```

### Generic Types

Types that can be extended or customized:

```typescript
// Coverage filter predicate
type CoverageFilter = (file: FileCoverage) => boolean

// Coverage threshold configuration
type CoverageThresholds = {
  lines: number
  functions: number
  branches: number
}

// Coverage level classification
type CoverageLevel = 'high' | 'medium' | 'low'
```

### Union Types

Common union types for specific use cases:

```typescript
// Coverage metric types
type CoverageMetric = 'lines' | 'functions' | 'branches'

// HTML CSS class names for coverage levels
type CoverageClass = 'high' | 'medium' | 'low' | 'uncovered'
```

## Type Usage Examples

### Analyzing Coverage Data

```typescript
import { CoverageReport, FileCoverage, CoverageLevel } from 'lcoview'

function getCoverageLevel(percentage: number): CoverageLevel {
  if (percentage >= 80) return 'high'
  if (percentage >= 50) return 'medium'
  return 'low'
}

function analyzeCoverage(report: CoverageReport): void {
  const { summary } = report

  console.log('Overall Coverage:')
  console.log(`  Lines: ${summary.lines.percentage.toFixed(2)}% (${getCoverageLevel(summary.lines.percentage)})`)
  console.log(`  Functions: ${summary.functions.percentage.toFixed(2)}% (${getCoverageLevel(summary.functions.percentage)})`)
  console.log(`  Branches: ${summary.branches.percentage.toFixed(2)}% (${getCoverageLevel(summary.branches.percentage)})`)
}
```

### Filtering Files by Coverage

```typescript
import { CoverageReport, FileCoverage } from 'lcoview'

function findLowCoverageFiles(
  report: CoverageReport,
  threshold: number = 80
): FileCoverage[] {
  return report.files.filter(file => {
    const percentage = (file.lines.hit / file.lines.found) * 100
    return percentage < threshold
  })
}

// Usage
const lowCoverageFiles = findLowCoverageFiles(report, 80)
console.log(`Found ${lowCoverageFiles.length} files with <80% coverage`)
```

### Custom Report Statistics

```typescript
import { CoverageReport, CoverageStats } from 'lcoview'

function calculateCustomStats(report: CoverageReport): {
  averageCoverage: number
  filesAboveThreshold: number
  uncoveredLines: number
} {
  const totalFiles = report.files.length
  const filesAbove80 = report.files.filter(file => {
    const percentage = (file.lines.hit / file.lines.found) * 100
    return percentage >= 80
  }).length

  const uncoveredLines = report.summary.lines.total - report.summary.lines.covered

  return {
    averageCoverage: report.summary.lines.percentage,
    filesAboveThreshold: filesAbove80,
    uncoveredLines
  }
}
```

### Type-Safe Coverage Thresholds

```typescript
import { CoverageReport, CoverageThresholds } from 'lcoview'

function checkThresholds(
  report: CoverageReport,
  thresholds: CoverageThresholds
): { passed: boolean; failures: string[] } {
  const failures: string[] = []

  if (report.summary.lines.percentage < thresholds.lines) {
    failures.push(`Lines: ${report.summary.lines.percentage.toFixed(2)}% < ${thresholds.lines}%`)
  }

  if (report.summary.functions.percentage < thresholds.functions) {
    failures.push(`Functions: ${report.summary.functions.percentage.toFixed(2)}% < ${thresholds.functions}%`)
  }

  if (report.summary.branches.percentage < thresholds.branches) {
    failures.push(`Branches: ${report.summary.branches.percentage.toFixed(2)}% < ${thresholds.branches}%`)
  }

  return {
    passed: failures.length === 0,
    failures
  }
}

// Usage
const thresholds: CoverageThresholds = {
  lines: 80,
  functions: 85,
  branches: 75
}

const result = checkThresholds(report, thresholds)
if (!result.passed) {
  console.error('Coverage thresholds not met:')
  result.failures.forEach(failure => console.error(`  - ${failure}`))
  process.exit(1)
}
```

### Working with Line Details

```typescript
import { FileCoverage, LineDetail } from 'lcoview'

function findUncoveredLines(file: FileCoverage): number[] {
  return file.lines.details
    .filter(line => line.executionCount === 0)
    .map(line => line.lineNumber)
}

function findHotspots(file: FileCoverage, threshold: number = 100): LineDetail[] {
  return file.lines.details
    .filter(line => line.executionCount > threshold)
    .sort((a, b) => b.executionCount - a.executionCount)
}

// Usage
const uncovered = findUncoveredLines(fileCoverage)
console.log(`Uncovered lines: ${uncovered.join(', ')}`)

const hotspots = findHotspots(fileCoverage, 100)
console.log('Most executed lines:')
hotspots.slice(0, 5).forEach(line => {
  console.log(`  Line ${line.lineNumber}: ${line.executionCount} executions`)
})
```
