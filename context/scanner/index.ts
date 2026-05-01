import fs from "fs"
import path from "path"

const IGNORE_DIRS = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  ".orka"
]

const IGNORE_FILES = [
  ".env"
]

export function scanFiles(dir: string, baseDir = dir): string[] {
  let results: string[] = []

  const list = fs.readdirSync(dir)

  for (const file of list) {
    const fullPath = path.join(dir, file)
    const relativePath = path.relative(baseDir, fullPath)

    const stat = fs.statSync(fullPath)

    // Skip ignored directories
    if (stat.isDirectory()) {
      if (IGNORE_DIRS.includes(file)) continue
      results = results.concat(scanFiles(fullPath, baseDir))
    } else {
      // Skip ignored files
      if (IGNORE_FILES.includes(file)) continue

      results.push(relativePath)
    }
  }

  return results
}