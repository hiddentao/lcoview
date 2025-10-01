import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { loadTemplate, renderTemplate } from "../utils/template.js"
import type { CoverageReport, FileCoverage } from "./types.js"

export class HtmlGenerator {
  async generate(
    report: CoverageReport,
    destDir: string,
    sourceDir: string,
  ): Promise<string[]> {
    const generatedFiles: string[] = []

    const indexHtml = await this.generateIndex(report, destDir)
    generatedFiles.push(indexHtml)

    for (const file of report.files) {
      const fileHtml = await this.generateFileReport(file, destDir, sourceDir)
      generatedFiles.push(fileHtml)
    }

    return generatedFiles
  }

  private async generateIndex(
    report: CoverageReport,
    _destDir: string,
  ): Promise<string> {
    const { summary, files } = report

    const summaryHtml = `
        <div class="summary-item">
          <h3>Lines</h3>
          <div class="value ${this.getCoverageClass(summary.lines.percentage)}">${summary.lines.percentage.toFixed(2)}%</div>
          <div class="label">${summary.lines.covered}/${summary.lines.total} covered</div>
        </div>
        <div class="summary-item">
          <h3>Functions</h3>
          <div class="value ${this.getCoverageClass(summary.functions.percentage)}">${summary.functions.percentage.toFixed(2)}%</div>
          <div class="label">${summary.functions.covered}/${summary.functions.total} covered</div>
        </div>
        <div class="summary-item">
          <h3>Branches</h3>
          <div class="value ${this.getCoverageClass(summary.branches.percentage)}">${summary.branches.percentage.toFixed(2)}%</div>
          <div class="label">${summary.branches.covered}/${summary.branches.total} covered</div>
        </div>`

    const rows = files
      .map((file) => {
        const linePercent =
          file.lines.found > 0
            ? ((file.lines.hit / file.lines.found) * 100).toFixed(2)
            : "0.00"
        const funcPercent =
          file.functions.found > 0
            ? ((file.functions.hit / file.functions.found) * 100).toFixed(2)
            : "0.00"
        const branchPercent =
          file.branches.found > 0
            ? ((file.branches.hit / file.branches.found) * 100).toFixed(2)
            : "0.00"

        const fileName = this.getHtmlFileName(file.path)
        const lineClass = this.getCoverageClass(Number.parseFloat(linePercent))

        return `
        <tr class="file-row" data-path="${this.escapeHtml(file.path)}">
          <td><a href="${this.escapeHtml(fileName)}">${this.escapeHtml(file.path)}</a></td>
          <td class="${lineClass}">${linePercent}%</td>
          <td>${file.lines.hit}/${file.lines.found}</td>
          <td>${funcPercent}%</td>
          <td>${file.functions.hit}/${file.functions.found}</td>
          <td>${branchPercent}%</td>
          <td>${file.branches.hit}/${file.branches.found}</td>
        </tr>`
      })
      .join("")

    const template = await loadTemplate("index.html")
    return renderTemplate(template, {
      SUMMARY: summaryHtml,
      FILE_ROWS: rows,
    })
  }

  private async generateFileReport(
    file: FileCoverage,
    _destDir: string,
    sourceDir: string,
  ): Promise<string> {
    const linePercent =
      file.lines.found > 0
        ? ((file.lines.hit / file.lines.found) * 100).toFixed(2)
        : "0.00"
    const funcPercent =
      file.functions.found > 0
        ? ((file.functions.hit / file.functions.found) * 100).toFixed(2)
        : "0.00"
    const branchPercent =
      file.branches.found > 0
        ? ((file.branches.hit / file.branches.found) * 100).toFixed(2)
        : "0.00"

    const statsHtml = `
        <div class="stat-item">
          <div class="label">Line Coverage</div>
          <div class="value ${this.getCoverageClass(Number.parseFloat(linePercent))}">${linePercent}% <span style="font-size: 14px; opacity: 0.8;">(${file.lines.hit}/${file.lines.found})</span></div>
        </div>
        <div class="stat-item">
          <div class="label">Function Coverage</div>
          <div class="value ${this.getCoverageClass(Number.parseFloat(funcPercent))}">${funcPercent}% <span style="font-size: 14px; opacity: 0.8;">(${file.functions.hit}/${file.functions.found})</span></div>
        </div>
        <div class="stat-item">
          <div class="label">Branch Coverage</div>
          <div class="value ${this.getCoverageClass(Number.parseFloat(branchPercent))}">${branchPercent}% <span style="font-size: 14px; opacity: 0.8;">(${file.branches.hit}/${file.branches.found})</span></div>
        </div>`

    const sourceFilePath = join(sourceDir, file.path)
    let sourceCode = ""
    try {
      sourceCode = await readFile(sourceFilePath, "utf-8")
    } catch {
      sourceCode = "// Source file not found"
    }

    const lineMap = new Map<number, number>()
    for (const line of file.lines.details) {
      lineMap.set(line.lineNumber, line.executionCount)
    }

    const lines = sourceCode.split("\n")
    const codeHtml = lines
      .map((lineContent, idx) => {
        const lineNum = idx + 1
        const execCount = lineMap.get(lineNum)
        let lineClass = "uncovered"
        let hitCount = ""

        if (execCount !== undefined) {
          if (execCount > 0) {
            lineClass = "covered"
            hitCount = `<span class="hit-count">${execCount}x</span>`
          }
        } else {
          lineClass = "neutral"
        }

        return `
        <tr class="${lineClass}">
          <td class="line-number">${lineNum}</td>
          <td class="hit-info">${hitCount}</td>
          <td class="source-code">${this.escapeHtml(lineContent)}</td>
        </tr>`
      })
      .join("")

    const template = await loadTemplate("file.html")
    return renderTemplate(template, {
      FILE_PATH: this.escapeHtml(file.path),
      FILE_STATS: statsHtml,
      SOURCE_CODE: codeHtml,
    })
  }

  private getCoverageClass(percentage: number): string {
    if (percentage >= 80) return "high"
    if (percentage >= 50) return "medium"
    return "low"
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }
    return text.replace(/[&<>"']/g, (m) => map[m] || m)
  }

  private getHtmlFileName(filePath: string): string {
    return `${filePath.replace(/[/\\:]/g, "_")}.html`
  }
}
