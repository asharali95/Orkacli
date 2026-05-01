import fs from "fs"
import path from "path"
import { callLLM } from "../../llm/client"
import { logger } from "../../core/logger"

export async function generateImplementation(spec: string): Promise<string> {
  logger.info("Calling LLM for implementation...")

  const prompt = `
You are a senior software engineer.

Your job is to implement the following specification.

IMPORTANT:
- Output ONLY a valid unified diff
- Do NOT include explanations
- Do NOT include markdown code blocks
- Only modify files listed in the spec
- If a file does not exist, create it
- Follow existing project structure

---

SPECIFICATION:
${spec}

---

OUTPUT FORMAT EXAMPLE:

--- a/src/file.ts
+++ b/src/file.ts
@@
+ new code here

---

Rules:
- MUST be valid unified diff
- MUST NOT include any text outside diff
`

  const response = await callLLM(prompt)

  // -------------------------
  // BASIC VALIDATION
  // -------------------------
  if (!response.includes("---") || !response.includes("+++")) {
    logger.error("Invalid diff format from LLM")
    throw new Error("Implementation generation failed")
  }

  const filePath = path.join(process.cwd(), ".orka", "patch.diff")

  fs.writeFileSync(filePath, response)

  logger.success("Implementation diff generated")

  return response
}