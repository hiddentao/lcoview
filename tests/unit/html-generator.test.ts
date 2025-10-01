import { describe, expect, test } from "bun:test"
import { HtmlGenerator } from "../../src/core/html-generator.js"
import type { CoverageReport } from "../../src/core/types.js"

describe("HtmlGenerator", () => {
  const generator = new HtmlGenerator()

  const mockReport: CoverageReport = {
    files: [
      {
        path: "src/test.ts",
        lines: {
          found: 10,
          hit: 8,
          details: [{ lineNumber: 1, executionCount: 5 }],
        },
        functions: { found: 2, hit: 2, details: [] },
        branches: { found: 0, hit: 0, details: [] },
      },
    ],
    summary: {
      lines: { total: 10, covered: 8, percentage: 80 },
      functions: { total: 2, covered: 2, percentage: 100 },
      branches: { total: 0, covered: 0, percentage: 0 },
    },
  }

  test("generates index page HTML", async () => {
    const html = await generator["generateIndex"](mockReport, "/tmp/test")

    expect(html).toContain("Coverage Report")
    expect(html).toContain("80.00%")
    expect(html).toContain("src/test.ts")
    expect(html).toContain("fileSearch")
  })

  test("escapes HTML in file paths", async () => {
    const reportWithSpecialChars: CoverageReport = {
      files: [
        {
          path: "src/<script>.ts",
          lines: { found: 1, hit: 1, details: [] },
          functions: { found: 0, hit: 0, details: [] },
          branches: { found: 0, hit: 0, details: [] },
        },
      ],
      summary: {
        lines: { total: 1, covered: 1, percentage: 100 },
        functions: { total: 0, covered: 0, percentage: 0 },
        branches: { total: 0, covered: 0, percentage: 0 },
      },
    }

    const html = await generator["generateIndex"](
      reportWithSpecialChars,
      "/tmp/test",
    )
    expect(html).toContain("&lt;script&gt;")
    expect(html).toContain('data-path="src/&lt;script&gt;.ts"')
    expect(html).toContain('href="src_&lt;script&gt;.ts.html"')
  })

  test("applies correct CSS classes for coverage levels", () => {
    expect(generator["getCoverageClass"](85)).toBe("high")
    expect(generator["getCoverageClass"](60)).toBe("medium")
    expect(generator["getCoverageClass"](30)).toBe("low")
  })

  test("generates valid HTML file names", () => {
    expect(generator["getHtmlFileName"]("src/test.ts")).toBe("src_test.ts.html")
    expect(generator["getHtmlFileName"]("path/to/file.js")).toBe(
      "path_to_file.js.html",
    )
  })

  test("generate() method returns array of HTML strings", async () => {
    const result = await generator.generate(
      mockReport,
      "/tmp/test",
      process.cwd(),
    )

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(2)
    expect(result[0]).toContain("Coverage Report")
    expect(result[1]).toContain("src/test.ts")
  })
})
