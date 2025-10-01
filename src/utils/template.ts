import { existsSync } from "node:fs"
import { readFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export async function loadTemplate(templateName: string): Promise<string> {
  const paths = [
    join(__dirname, "../../templates", templateName),
    join(process.cwd(), "templates", templateName),
  ]

  for (const path of paths) {
    if (existsSync(path)) {
      return await readFile(path, "utf-8")
    }
  }

  throw new Error(
    `Template not found: ${templateName} (searched: ${paths.join(", ")})`,
  )
}

export function renderTemplate(
  template: string,
  replacements: Record<string, string>,
): string {
  let result = template
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replaceAll(`{{${key}}}`, value)
  }
  return result
}
