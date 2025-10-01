import { afterEach, beforeEach, describe, expect, test } from "bun:test"
import { existsSync, mkdirSync, rmSync } from "node:fs"
import { join } from "node:path"
import { $ } from "bun"

describe("CLI Integration", () => {
  const testOutputDir = join(process.cwd(), "test-output")

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

  test("generates report from simple lcov file", async () => {
    const lcovPath = join(process.cwd(), "tests/fixtures/simple.lcov")
    const sourcePath = join(process.cwd(), "tests/fixtures/sample-sources")

    const result =
      await $`bun run bin/lcoview.js ${lcovPath} -s ${sourcePath} -d ${testOutputDir} -q`.quiet()

    expect(result.exitCode).toBe(0)
    expect(existsSync(join(testOutputDir, "index.html"))).toBe(true)
  })

  test("generates report from multi-file lcov", async () => {
    const lcovPath = join(process.cwd(), "tests/fixtures/multi-file.lcov")

    const result =
      await $`bun run bin/lcoview.js ${lcovPath} -d ${testOutputDir} -q`.quiet()

    expect(result.exitCode).toBe(0)
    expect(existsSync(join(testOutputDir, "index.html"))).toBe(true)
  })

  test("shows error for missing file", async () => {
    const result = await $`bun run bin/lcoview.js nonexistent.lcov -q`
      .nothrow()
      .quiet()

    expect(result.exitCode).not.toBe(0)
  })
})
