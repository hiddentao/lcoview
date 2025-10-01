import { describe, expect, test } from "bun:test"
import { loadTemplate, renderTemplate } from "../../src/utils/template.js"

describe("Template Utils", () => {
  describe("loadTemplate", () => {
    test("loads existing template", async () => {
      const template = await loadTemplate("index.html")
      expect(template).toContain("{{SUMMARY}}")
      expect(template).toContain("{{FILE_ROWS}}")
    })

    test("throws error for non-existent template", async () => {
      await expect(loadTemplate("non-existent.html")).rejects.toThrow(
        "Template not found",
      )
    })
  })

  describe("renderTemplate", () => {
    test("replaces single placeholder", () => {
      const template = "<div>{{NAME}}</div>"
      const result = renderTemplate(template, { NAME: "Test" })
      expect(result).toBe("<div>Test</div>")
    })

    test("replaces multiple placeholders", () => {
      const template = "<h1>{{TITLE}}</h1><p>{{CONTENT}}</p>"
      const result = renderTemplate(template, {
        TITLE: "Hello",
        CONTENT: "World",
      })
      expect(result).toBe("<h1>Hello</h1><p>World</p>")
    })

    test("replaces same placeholder multiple times", () => {
      const template = "{{VAR}} and {{VAR}} again"
      const result = renderTemplate(template, { VAR: "foo" })
      expect(result).toBe("foo and foo again")
    })

    test("handles empty replacements", () => {
      const template = "<div>{{PLACEHOLDER}}</div>"
      const result = renderTemplate(template, {})
      expect(result).toBe("<div>{{PLACEHOLDER}}</div>")
    })

    test("handles special characters in replacements", () => {
      const template = "<div>{{CONTENT}}</div>"
      const result = renderTemplate(template, {
        CONTENT: "<script>alert('xss')</script>",
      })
      expect(result).toBe("<div><script>alert('xss')</script></div>")
    })
  })
})
