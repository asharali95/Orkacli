import fs from "fs"
import path from "path"
import readline from "readline"
import { parseDiff } from "../parser"
import { logger } from "../../core/logger"

function askUser(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

export async function applyPatchWithApproval(diff: string) {
  logger.info("Parsing diff...")

  const patches = parseDiff(diff)

  if (patches.length === 0) {
    throw new Error("No valid patches found")
  }

  console.log("\n📌 Proposed Changes:\n")
  console.log(diff) // raw diff (simple but effective)

  const answer = await askUser("\nDo you want to apply these changes? (y/n): ")

  if (answer.toLowerCase() !== "y") {
    logger.info("User rejected changes ❌")
    return { applied: false }
  }

  logger.info("User approved changes ✅")

  for (const patch of patches) {
    const filePath = path.join(process.cwd(), patch.filePath)

    try {
      if (fs.existsSync(filePath)) {
        fs.copyFileSync(filePath, filePath + ".bak")
      }

      let existingContent = ""
      if (fs.existsSync(filePath)) {
        existingContent = fs.readFileSync(filePath, "utf-8")
      }

      const newContent =
        existingContent +
        "\n\n// Orka Applied Changes\n" +
        patch.changes.join("\n")

      fs.mkdirSync(path.dirname(filePath), { recursive: true })
      fs.writeFileSync(filePath, newContent)

      logger.success(`Updated ${patch.filePath}`)

    } catch (error: any) {
      logger.error(`Failed to apply patch: ${error.message}`)
      throw error
    }
  }

  return { applied: true }
}