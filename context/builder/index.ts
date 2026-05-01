import fs from "fs"
import path from "path"
import { scanFiles } from "../scanner"
import { logger } from "../../core/logger"

export function buildContext() {
  const projectRoot = process.cwd()

  logger.info("Scanning project files...")

  const files = scanFiles(projectRoot)

  logger.info(`Found ${files.length} files`)

  // -------------------------
  // Detect package.json
  // -------------------------
  let dependencies = {}
  let devDependencies = {}
  let scripts = {}

  const packagePath = path.join(projectRoot, "package.json")

  if (fs.existsSync(packagePath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packagePath, "utf-8"))

      dependencies = pkg.dependencies || {}
      devDependencies = pkg.devDependencies || {}
      scripts = pkg.scripts || {}
    } catch (err) {
      logger.error("Failed to parse package.json")
    }
  }

  // -------------------------
  // Detect entry points
  // -------------------------
  const entryCandidates = files.filter(f =>
    f.includes("index.") ||
    f.includes("main.") ||
    f.includes("app.")
  )

  // -------------------------
  // Limit files (VERY IMPORTANT)
  // -------------------------
  const MAX_FILES = 100

  const limitedFiles = files.slice(0, MAX_FILES)

  // -------------------------
  // Build context object
  // -------------------------
  const context = {
    projectType: fs.existsSync(packagePath) ? "node" : "unknown",
    totalFiles: files.length,
    files: limitedFiles,
    entryPoints: entryCandidates.slice(0, 10),
    dependencies,
    scripts
  }

  return context
}