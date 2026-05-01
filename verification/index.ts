import { exec } from "child_process"
import fs from "fs"
import path from "path"
import { logger } from "../core/logger"

function runCommand(command: string): Promise<{ success: boolean; output: string }> {
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return resolve({
          success: false,
          output: stderr || error.message
        })
      }

      resolve({
        success: true,
        output: stdout
      })
    })
  })
}

function getPackageScripts() {
  const packagePath = path.join(process.cwd(), "package.json")

  if (!fs.existsSync(packagePath)) return {}

  const pkg = JSON.parse(fs.readFileSync(packagePath, "utf-8"))
  return pkg.scripts || {}
}

export async function runVerification() {
  logger.info("Starting verification...")

  const scripts = getPackageScripts()

  let results: any = {
    build: null,
    test: null,
    success: true
  }

  // -------------------------
  // BUILD
  // -------------------------
  if (scripts.build) {
    logger.info("Running build...")

    const buildResult = await runCommand("npm run build")
    results.build = buildResult

    if (!buildResult.success) {
      logger.error("Build failed")
      results.success = false
    } else {
      logger.success("Build passed")
    }
  } else {
    logger.info("No build script found, skipping...")
  }

  // -------------------------
  // TEST
  // -------------------------
  if (scripts.test && scripts.test !== "echo \"Error: no test specified\" && exit 1") {
    logger.info("Running tests...")

    const testResult = await runCommand("npm test")
    results.test = testResult

    if (!testResult.success) {
      logger.error("Tests failed")
      results.success = false
    } else {
      logger.success("Tests passed")
    }
  } else {
    logger.info("No valid test script found, skipping...")
  }

  return results
}