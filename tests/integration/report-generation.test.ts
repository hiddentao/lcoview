import { afterEach, beforeEach, describe, expect, test } from "bun:test"
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs"
import { join } from "node:path"
import { generateReport } from "../../src/index.js"

describe("Report Generation", () => {
  const testOutputDir = join(process.cwd(), "test-output-integration")

  beforeEach(() => {
    if (existsSync(testOutputDir)) {
      rmSync(testOutputDir, { recursive: true, force: true })
    }
    mkdirSync(testOutputDir, { recursive: true })
  })

  afterEach(() => {
    if (existsSync(testOutputDir)) {
      rmSync(testOutputDir, { recursive: true, force: true })
    }
  })

  test("generates complete HTML report", async () => {
    const lcovPath = join(process.cwd(), "tests/fixtures/simple.lcov")
    const sourcePath = join(process.cwd(), "tests/fixtures/sample-sources")

    const indexPath = await generateReport({
      lcovFilePath: lcovPath,
      sourceDir: sourcePath,
      destDir: testOutputDir,
      quiet: true,
    })

    expect(existsSync(indexPath)).toBe(true)

    const indexContent = readFileSync(indexPath, "utf-8")
    expect(indexContent).toContain("Coverage Report")
    expect(indexContent).toContain("src/utils/math.ts")
  })

  test("generates file-specific reports", async () => {
    const lcovPath = join(process.cwd(), "tests/fixtures/multi-file.lcov")

    const indexPath = await generateReport({
      lcovFilePath: lcovPath,
      destDir: testOutputDir,
      quiet: true,
    })

    expect(existsSync(indexPath)).toBe(true)
    expect(existsSync(join(testOutputDir, "src_index.ts.html"))).toBe(true)
    expect(existsSync(join(testOutputDir, "src_utils_helpers.ts.html"))).toBe(
      true,
    )
  })

  test("handles zero coverage correctly", async () => {
    const lcovPath = join(process.cwd(), "tests/fixtures/zero-coverage.lcov")

    const indexPath = await generateReport({
      lcovFilePath: lcovPath,
      destDir: testOutputDir,
      quiet: true,
    })

    const indexContent = readFileSync(indexPath, "utf-8")
    expect(indexContent).toContain("0.00%")
  })

  test("handles full coverage correctly", async () => {
    const lcovPath = join(process.cwd(), "tests/fixtures/full-coverage.lcov")

    const indexPath = await generateReport({
      lcovFilePath: lcovPath,
      destDir: testOutputDir,
      quiet: true,
    })

    const indexContent = readFileSync(indexPath, "utf-8")
    expect(indexContent).toContain("100.00%")
  })
})
