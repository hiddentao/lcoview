import type { CoverageReport, CoverageSummary, FileCoverage } from "./types.js"

export class LcovParser {
  parse(content: string): CoverageReport {
    const files: FileCoverage[] = []
    const lines = content.split("\n")

    let currentFile: FileCoverage | null = null

    for (const line of lines) {
      const trimmed = line.trim()

      if (trimmed.startsWith("SF:")) {
        const filePath = trimmed.substring(3)
        currentFile = {
          path: filePath,
          lines: { found: 0, hit: 0, details: [] },
          functions: { found: 0, hit: 0, details: [] },
          branches: { found: 0, hit: 0, details: [] },
        }
      } else if (trimmed.startsWith("FN:")) {
        if (currentFile) {
          const parts = trimmed.substring(3).split(",")
          const lineNumber = Number.parseInt(parts[0] || "0", 10)
          const functionName = parts.slice(1).join(",")
          currentFile.functions.details.push({
            name: functionName,
            lineNumber,
            executionCount: 0,
          })
        }
      } else if (trimmed.startsWith("FNDA:")) {
        if (currentFile) {
          const parts = trimmed.substring(5).split(",")
          const executionCount = Number.parseInt(parts[0] || "0", 10)
          const functionName = parts.slice(1).join(",")
          const func = currentFile.functions.details.find(
            (f) => f.name === functionName,
          )
          if (func) {
            func.executionCount = executionCount
          }
        }
      } else if (trimmed.startsWith("FNF:")) {
        if (currentFile) {
          currentFile.functions.found = Number.parseInt(
            trimmed.substring(4),
            10,
          )
        }
      } else if (trimmed.startsWith("FNH:")) {
        if (currentFile) {
          currentFile.functions.hit = Number.parseInt(trimmed.substring(4), 10)
        }
      } else if (trimmed.startsWith("DA:")) {
        if (currentFile) {
          const parts = trimmed.substring(3).split(",")
          const lineNumber = Number.parseInt(parts[0] || "0", 10)
          const executionCount = Number.parseInt(parts[1] || "0", 10)
          currentFile.lines.details.push({
            lineNumber,
            executionCount,
          })
        }
      } else if (trimmed.startsWith("LF:")) {
        if (currentFile) {
          currentFile.lines.found = Number.parseInt(trimmed.substring(3), 10)
        }
      } else if (trimmed.startsWith("LH:")) {
        if (currentFile) {
          currentFile.lines.hit = Number.parseInt(trimmed.substring(3), 10)
        }
      } else if (trimmed.startsWith("BRDA:")) {
        if (currentFile) {
          const parts = trimmed.substring(5).split(",")
          const lineNumber = Number.parseInt(parts[0] || "0", 10)
          const blockNumber = Number.parseInt(parts[1] || "0", 10)
          const branchNumber = Number.parseInt(parts[2] || "0", 10)
          const taken =
            parts[3] === "-" ? 0 : Number.parseInt(parts[3] || "0", 10)
          currentFile.branches.details.push({
            lineNumber,
            blockNumber,
            branchNumber,
            taken,
          })
        }
      } else if (trimmed.startsWith("BRF:")) {
        if (currentFile) {
          currentFile.branches.found = Number.parseInt(trimmed.substring(4), 10)
        }
      } else if (trimmed.startsWith("BRH:")) {
        if (currentFile) {
          currentFile.branches.hit = Number.parseInt(trimmed.substring(4), 10)
        }
      } else if (trimmed === "end_of_record") {
        if (currentFile) {
          files.push(currentFile)
          currentFile = null
        }
      }
    }

    const summary = this.calculateSummary(files)

    return { files, summary }
  }

  private calculateSummary(files: FileCoverage[]): CoverageSummary {
    let totalLines = 0
    let coveredLines = 0
    let totalFunctions = 0
    let coveredFunctions = 0
    let totalBranches = 0
    let coveredBranches = 0

    for (const file of files) {
      totalLines += file.lines.found
      coveredLines += file.lines.hit
      totalFunctions += file.functions.found
      coveredFunctions += file.functions.hit
      totalBranches += file.branches.found
      coveredBranches += file.branches.hit
    }

    return {
      lines: {
        total: totalLines,
        covered: coveredLines,
        percentage: totalLines > 0 ? (coveredLines / totalLines) * 100 : 0,
      },
      functions: {
        total: totalFunctions,
        covered: coveredFunctions,
        percentage:
          totalFunctions > 0 ? (coveredFunctions / totalFunctions) * 100 : 0,
      },
      branches: {
        total: totalBranches,
        covered: coveredBranches,
        percentage:
          totalBranches > 0 ? (coveredBranches / totalBranches) * 100 : 0,
      },
    }
  }
}
