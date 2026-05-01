import fs from "fs"
import path from "path"
import { callLLM } from "../../llm/client"
import { logger } from "../../core/logger"

export async function generateSpec(task: string, context: any): Promise<string> {
  logger.info("Calling LLM for spec generation...")

  const prompt = `
You are a senior software engineer.

Your job is to generate a STRICT implementation plan.

Follow this EXACT format. Do not add anything extra.

---

TASK:
${task}

---

PROJECT CONTEXT:
${JSON.stringify(context, null, 2)}

---

OUTPUT FORMAT:

# Task
<repeat the task>

# Files to Modify
- file/path1
- file/path2

# Implementation Plan
1. Step one
2. Step two

# Edge Cases
- case one
- case two

# Tests
- test one
- test two

---

Rules:
- Only include relevant files
- Be specific
- Do not explain anything outside format
- Do not add markdown code blocks
`

  const response = await callLLM(prompt)

  // -------------------------
  // BASIC VALIDATION
  // -------------------------
  if (
    !response.includes("# Task") ||
    !response.includes("# Files to Modify") ||
    !response.includes("# Implementation Plan")
  ) {
    logger.error("Invalid spec format from LLM")
    throw new Error("Spec generation failed")
  }

  const filePath = path.join(process.cwd(), ".orka", "IMPLEMENTATION_PROMPT.md")

  fs.writeFileSync(filePath, response)

  logger.success("Spec generated successfully")

  return response
}