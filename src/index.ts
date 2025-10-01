import { readFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { HtmlGenerator } from "./core/html-generator.js"
import { LcovParser } from "./core/lcov-parser.js"
import type { GenerateOptions } from "./core/types.js"
import { writeHtmlFile } from "./utils/file.js"

export async function generateReport(
  options: GenerateOptions,
): Promise<string> {
  const {
    lcovFilePath,
    sourceDir = process.cwd(),
    destDir = join(tmpdir(), `lcoview-${Date.now()}`),
  } = options

  const lcovContent = await readFile(lcovFilePath, "utf-8")

  const parser = new LcovParser()
  const report = parser.parse(lcovContent)

  const generator = new HtmlGenerator()
  const indexHtml = await generator["generateIndex"](report, destDir)
  const indexPath = join(destDir, "index.html")
  await writeHtmlFile(indexPath, indexHtml)

  for (const file of report.files) {
    const fileHtml = await generator["generateFileReport"](
      file,
      destDir,
      sourceDir,
    )
    const fileName = generator["getHtmlFileName"](file.path)
    const filePath = join(destDir, fileName)
    await writeHtmlFile(filePath, fileHtml)
  }

  return indexPath
}

export { LcovParser } from "./core/lcov-parser.js"
export { HtmlGenerator } from "./core/html-generator.js"
export type {
  BranchDetails,
  CoverageReport,
  CoverageSummary,
  FileCoverage,
  FunctionDetails,
  GenerateOptions,
  LineDetails,
} from "./core/types.js"
