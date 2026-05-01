import fs from "fs"
import path from "path"
import { callLLM } from "../../llm/client"
import { logger } from "../../core/logger"

export async function runReview() {
  const diffPath = path.join(process.cwd(), ".orka", "patch.diff")

  if (!fs.existsSync(diffPath)) {
    throw new Error("No patch.diff found. Run implement first.")
  }

  const diff = fs.readFileSync(diffPath, "utf-8")

  logger.info("Reviewing changes...")

  const prompt = `
You are a senior engineer reviewing code changes.

Analyze the following diff and list:
- bugs
- bad practices
- missing edge cases

Return output in this format:

# Issues
- issue 1
- issue 2

# Suggested Fixes
- fix 1
- fix 2

---

DIFF:
${diff}
`

  const response = await callLLM(prompt)

  const outputPath = path.join(process.cwd(), ".orka", "REQUIRED_CHANGES.md")

  fs.writeFileSync(outputPath, response)

  logger.success("Review completed → REQUIRED_CHANGES.md created")
}