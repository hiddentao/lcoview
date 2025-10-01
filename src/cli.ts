#!/usr/bin/env node

import chalk from "chalk"
import { Command } from "commander"
import open from "open"
import { generateReport } from "./index.js"

const program = new Command()

program
  .name("lcoview")
  .description(
    "LCOV coverage report viewer - generates interactive HTML reports",
  )
  .version("1.0.0")
  .argument("<lcov-file>", "Path to lcov.info file")
  .option(
    "-s, --source-dir <path>",
    "Source directory for files referenced in lcov.info",
    process.cwd(),
  )
  .option(
    "-d, --dest-dir <path>",
    "Output directory for HTML report (default: temp folder)",
  )
  .option("-o, --open", "Open browser to index.html after generation", false)
  .option("-q, --quiet", "Suppress output", false)
  .action(async (lcovFile: string, options: any) => {
    try {
      const startTime = Date.now()

      if (!options.quiet) {
        console.log(chalk.blue("📊 Generating coverage report..."))
      }

      const indexPath = await generateReport({
        lcovFilePath: lcovFile,
        sourceDir: options.sourceDir,
        destDir: options.destDir,
        quiet: options.quiet,
      })

      const elapsed = Date.now() - startTime

      if (!options.quiet) {
        console.log(chalk.green("✓"), `Report generated in ${elapsed}ms`)
        console.log(chalk.gray(`  ${indexPath}`))
      }

      if (options.open) {
        if (!options.quiet) {
          console.log(chalk.blue("🌐 Opening browser..."))
        }
        await open(indexPath)
      }
    } catch (error) {
      console.error(
        chalk.red("Error:"),
        error instanceof Error ? error.message : String(error),
      )
      process.exit(1)
    }
  })

program.parse()
