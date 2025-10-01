import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { LcovParser } from "../../src/core/lcov-parser.js"

describe("LcovParser", () => {
  const parser = new LcovParser()

  test("parses simple lcov file", () => {
    const lcovPath = join(__dirname, "../fixtures/simple.lcov")
    const content = readFileSync(lcovPath, "utf-8")
    const report = parser.parse(content)

    expect(report.files).toHaveLength(1)
    expect(report.files[0]?.path).toBe("src/utils/math.ts")
    expect(report.files[0]?.lines.found).toBe(4)
    expect(report.files[0]?.lines.hit).toBe(4)
    expect(report.files[0]?.functions.found).toBe(2)
    expect(report.files[0]?.functions.hit).toBe(2)
  })

  test("parses multi-file lcov", () => {
    const lcovPath = join(__dirname, "../fixtures/multi-file.lcov")
    const content = readFileSync(lcovPath, "utf-8")
    const report = parser.parse(content)

    expect(report.files).toHaveLength(3)
    expect(report.files[0]?.path).toBe("src/index.ts")
    expect(report.files[1]?.path).toBe("src/utils/helpers.ts")
    expect(report.files[2]?.path).toBe("src/lib/calculator.ts")
  })

  test("calculates correct summary", () => {
    const lcovPath = join(__dirname, "../fixtures/multi-file.lcov")
    const content = readFileSync(lcovPath, "utf-8")
    const report = parser.parse(content)

    expect(report.summary.lines.total).toBe(13)
    expect(report.summary.lines.covered).toBe(10)
    expect(report.summary.lines.percentage).toBeCloseTo(76.92, 1)

    expect(report.summary.functions.total).toBe(4)
    expect(report.summary.functions.covered).toBe(3)
    expect(report.summary.functions.percentage).toBe(75)

    expect(report.summary.branches.total).toBe(4)
    expect(report.summary.branches.covered).toBe(3)
    expect(report.summary.branches.percentage).toBe(75)
  })

  test("handles zero coverage", () => {
    const lcovPath = join(__dirname, "../fixtures/zero-coverage.lcov")
    const content = readFileSync(lcovPath, "utf-8")
    const report = parser.parse(content)

    expect(report.files).toHaveLength(1)
    expect(report.summary.lines.percentage).toBe(0)
    expect(report.summary.functions.percentage).toBe(0)
  })

  test("handles full coverage", () => {
    const lcovPath = join(__dirname, "../fixtures/full-coverage.lcov")
    const content = readFileSync(lcovPath, "utf-8")
    const report = parser.parse(content)

    expect(report.files).toHaveLength(1)
    expect(report.summary.lines.percentage).toBe(100)
    expect(report.summary.functions.percentage).toBe(100)
    expect(report.summary.branches.percentage).toBe(100)
  })

  test("parses line details correctly", () => {
    const lcovPath = join(__dirname, "../fixtures/simple.lcov")
    const content = readFileSync(lcovPath, "utf-8")
    const report = parser.parse(content)

    const file = report.files[0]
    expect(file?.lines.details).toHaveLength(4)
    expect(file?.lines.details[0]?.lineNumber).toBe(1)
    expect(file?.lines.details[0]?.executionCount).toBe(10)
  })

  test("parses function details correctly", () => {
    const lcovPath = join(__dirname, "../fixtures/simple.lcov")
    const content = readFileSync(lcovPath, "utf-8")
    const report = parser.parse(content)

    const file = report.files[0]
    expect(file?.functions.details).toHaveLength(2)
    expect(file?.functions.details[0]?.name).toBe("add")
    expect(file?.functions.details[0]?.executionCount).toBe(10)
    expect(file?.functions.details[1]?.name).toBe("subtract")
    expect(file?.functions.details[1]?.executionCount).toBe(5)
  })

  test("handles empty content", () => {
    const report = parser.parse("")
    expect(report.files).toHaveLength(0)
    expect(report.summary.lines.total).toBe(0)
  })
})
