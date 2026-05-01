import fs from "fs"
import path from "path"
import { callLLM } from "../../llm/client"
import { applyPatchWithApproval } from "../../patch/applier"
import { logger } from "../../core/logger"

export async function runFix() {
  const reviewPath = path.join(process.cwd(), ".orka", "REQUIRED_CHANGES.md")

  if (!fs.existsSync(reviewPath)) {
    throw new Error("No review file found. Run review first.")
  }

  const review = fs.readFileSync(reviewPath, "utf-8")

  logger.info("Generating fixes...")

  const prompt = `
  You are a senior software engineer.
  
  You MUST output ONLY a valid unified diff.
  
  DO NOT output explanations.
  DO NOT output markdown.
  DO NOT output text.
  
  ---
  
  REVIEW FEEDBACK:
  ${review}
  
  ---
  
  RULES:
  - Output MUST start with --- and +++
  - Modify only relevant files
  - If no fixes needed, output an empty diff like:
  --- a/empty.txt
  +++ b/empty.txt
  @@
  + // no changes
  
  ---
  
  EXAMPLE:
  
  --- a/src/file.ts
  +++ b/src/file.ts
  @@
  + console.log("fixed")
  
  ---
  
  Now generate the diff:
  `

  let diff = await callLLM(prompt)

  if (!diff.includes("---") || !diff.includes("+++")) {
    logger.error("Invalid diff from LLM, retrying...")
  
    diff = await callLLM(prompt)
  
    if (!diff.includes("---") || !diff.includes("+++")) {
      throw new Error("Fix generation failed: invalid diff format")
    }
  }
  const diffPath = path.join(process.cwd(), ".orka", "fix.diff")

  fs.writeFileSync(diffPath, diff)

  logger.success("Fix diff generated")

  await applyPatchWithApproval(diff)
}