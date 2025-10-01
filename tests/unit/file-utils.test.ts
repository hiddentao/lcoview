import { afterEach, beforeEach, describe, expect, test } from "bun:test"
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs"
import { join } from "node:path"
import { ensureDir, writeHtmlFile } from "../../src/utils/file.js"

describe("File Utils", () => {
  const testDir = join(process.cwd(), "test-file-utils")

  beforeEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
    }
  })

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
    }
  })

  test("ensureDir creates directory recursively", async () => {
    const deepDir = join(testDir, "a", "b", "c")
    await ensureDir(deepDir)

    expect(existsSync(deepDir)).toBe(true)
  })

  test("ensureDir handles existing directory", async () => {
    mkdirSync(testDir, { recursive: true })
    await ensureDir(testDir)

    expect(existsSync(testDir)).toBe(true)
  })

  test("writeHtmlFile creates file with content", async () => {
    const filePath = join(testDir, "test.html")
    const content = "<html><body>Test</body></html>"

    await writeHtmlFile(filePath, content)

    expect(existsSync(filePath)).toBe(true)
    const fileContent = readFileSync(filePath, "utf-8")
    expect(fileContent).toBe(content)
  })

  test("writeHtmlFile creates parent directories", async () => {
    const filePath = join(testDir, "nested", "dir", "test.html")
    const content = "<html><body>Nested</body></html>"

    await writeHtmlFile(filePath, content)

    expect(existsSync(filePath)).toBe(true)
    const fileContent = readFileSync(filePath, "utf-8")
    expect(fileContent).toBe(content)
  })

  test("ensureDir handles deeply nested paths", async () => {
    const deepPath = join(testDir, "a", "b", "c", "d", "e", "f")
    await ensureDir(deepPath)

    expect(existsSync(deepPath)).toBe(true)
  })

  test("writeHtmlFile handles empty content", async () => {
    const filePath = join(testDir, "empty.html")
    await writeHtmlFile(filePath, "")

    expect(existsSync(filePath)).toBe(true)
    const fileContent = readFileSync(filePath, "utf-8")
    expect(fileContent).toBe("")
  })

  test("writeHtmlFile overwrites existing file", async () => {
    const filePath = join(testDir, "overwrite.html")
    await writeHtmlFile(filePath, "original")
    await writeHtmlFile(filePath, "updated")

    const fileContent = readFileSync(filePath, "utf-8")
    expect(fileContent).toBe("updated")
  })
})
