import { describe, expect, test } from "bun:test"
import { formatPercentage, pluralize } from "../../src/utils/format.js"

describe("Format Utils", () => {
  describe("formatPercentage", () => {
    test("formats percentage with 2 decimal places", () => {
      expect(formatPercentage(85.123456)).toBe("85.12%")
      expect(formatPercentage(100)).toBe("100.00%")
      expect(formatPercentage(0)).toBe("0.00%")
    })

    test("handles edge cases", () => {
      expect(formatPercentage(0.005)).toBe("0.01%")
      expect(formatPercentage(99.999)).toBe("100.00%")
    })

    test("handles special numeric values", () => {
      expect(formatPercentage(NaN)).toBe("NaN%")
      expect(formatPercentage(Infinity)).toBe("Infinity%")
      expect(formatPercentage(-Infinity)).toBe("-Infinity%")
    })

    test("handles negative percentages", () => {
      expect(formatPercentage(-5.5)).toBe("-5.50%")
    })
  })

  describe("pluralize", () => {
    test("returns singular for count of 1", () => {
      expect(pluralize(1, "file")).toBe("file")
      expect(pluralize(1, "line")).toBe("line")
    })

    test("returns plural for count other than 1", () => {
      expect(pluralize(0, "file")).toBe("files")
      expect(pluralize(2, "file")).toBe("files")
      expect(pluralize(100, "file")).toBe("files")
    })

    test("uses custom plural form when provided", () => {
      expect(pluralize(1, "directory", "directories")).toBe("directory")
      expect(pluralize(0, "directory", "directories")).toBe("directories")
      expect(pluralize(5, "directory", "directories")).toBe("directories")
    })

    test("handles irregular plurals", () => {
      expect(pluralize(1, "child", "children")).toBe("child")
      expect(pluralize(3, "child", "children")).toBe("children")
    })

    test("handles negative counts", () => {
      expect(pluralize(-1, "file")).toBe("files")
      expect(pluralize(-5, "item")).toBe("items")
    })

    test("handles large numbers", () => {
      expect(pluralize(1000000, "item")).toBe("items")
    })
  })
})
