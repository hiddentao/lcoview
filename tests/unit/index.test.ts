import { afterEach, beforeEach, describe, expect, test } from "bun:test"
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { join } from "node:path"
import { generateReport } from "../../src/index.js"

describe("Index API", () => {
  const testDir = join(process.cwd(), "test-index-api")
  const testOutputDir = join(testDir, "output")
  const testLcovPath = join(testDir, "test.lcov")

  beforeEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
    }
    mkdirSync(testDir, { recursive: true })

    const lcovContent = `SF:src/test.ts
FN:1,testFunction
FNDA:10,testFunction
FNF:1
FNH:1
DA:1,10
DA:2,10
DA:3,0
LF:3
LH:2
end_of_record
`
    writeFileSync(testLcovPath, lcovContent)
  })

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
    }
  })

  test("generateReport creates index and file reports", async () => {
    const indexPath = await generateReport({
      lcovFilePath: testLcovPath,
      sourceDir: testDir,
      destDir: testOutputDir,
      quiet: true,
    })

    expect(existsSync(indexPath)).toBe(true)
    expect(indexPath).toContain("index.html")

    const indexContent = readFileSync(indexPath, "utf-8")
    expect(indexContent).toContain("Coverage Report")
    expect(indexContent).toContain("src/test.ts")
  })

  test("generateReport defaults to temp directory when destDir not specified", async () => {
    const indexPath = await generateReport({
      lcovFilePath: testLcovPath,
      quiet: true,
    })

    expect(existsSync(indexPath)).toBe(true)
    expect(indexPath).toContain("lcoview-")
  })

  test("generateReport creates individual file pages", async () => {
    await generateReport({
      lcovFilePath: testLcovPath,
      sourceDir: testDir,
      destDir: testOutputDir,
      quiet: true,
    })

    const fileReportPath = join(testOutputDir, "src_test.ts.html")
    expect(existsSync(fileReportPath)).toBe(true)

    const fileContent = readFileSync(fileReportPath, "utf-8")
    expect(fileContent).toContain("src/test.ts")
    expect(fileContent).toContain("Back to all files")
  })
})
