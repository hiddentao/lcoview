export interface LineDetails {
  lineNumber: number
  executionCount: number
}

export interface FunctionDetails {
  name: string
  lineNumber: number
  executionCount: number
}

export interface BranchDetails {
  lineNumber: number
  blockNumber: number
  branchNumber: number
  taken: number
}

export interface FileCoverage {
  path: string
  lines: {
    found: number
    hit: number
    details: LineDetails[]
  }
  functions: {
    found: number
    hit: number
    details: FunctionDetails[]
  }
  branches: {
    found: number
    hit: number
    details: BranchDetails[]
  }
}

export interface CoverageSummary {
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

export interface CoverageReport {
  files: FileCoverage[]
  summary: CoverageSummary
}

export interface GenerateOptions {
  lcovFilePath: string
  sourceDir?: string
  destDir?: string
  open?: boolean
  quiet?: boolean
}
