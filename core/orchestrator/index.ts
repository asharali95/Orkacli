import fs from "fs"
import path from "path"
import { logger } from "../logger"
import { generateSpec } from "../../spec/generator"
import { generateImplementation } from "../../implementation/agent"

// we’ll implement these next
import { buildContext } from "../../context/builder"
import { applyPatchWithApproval } from "../../patch/applier"
import { runVerification } from "../../verification"

export async function runPipeline(task: string) {
  logger.info("Starting pipeline...")

  const orkaDir = path.join(process.cwd(), ".orka")

  try {
    // -------------------------
    // STEP 1: CONTEXT
    // -------------------------
    logger.info("Building context...")

   
    const context = buildContext()

    fs.writeFileSync(
      path.join(orkaDir, "context.json"),
      JSON.stringify(context, null, 2)
    )

    logger.success("Context built")

    // -------------------------
    // STEP 2: SPEC
    // -------------------------
    logger.info("Generating spec...")


const spec = await generateSpec(task, context)

    fs.writeFileSync(
      path.join(orkaDir, "IMPLEMENTATION_PROMPT.md"),
      spec
    )

    logger.success("Spec generated")

    // -------------------------
    // STEP 3: IMPLEMENTATION
    // -------------------------
    logger.info("Generating implementation...")

    const patch = await generateImplementation(spec)
    
    fs.writeFileSync(
      path.join(orkaDir, "patch.diff"),
      patch
    )

    logger.success("Implementation generated")

    // -------------------------
    // STEP 4: PATCH APPLY
    // -------------------------
    logger.info("Applying patch...")

    // placeholder
    const patchResult = await applyPatchWithApproval(patch)

    if (!patchResult.applied) {
      logger.info("Pipeline stopped (no changes applied)")
      return
    }    
    // -------------------------
    // STEP 5: VERIFY
    // -------------------------
    logger.info("Running verification...")

    const result = await runVerification()

    fs.writeFileSync(
      path.join(orkaDir, "verification.json"),
      JSON.stringify(result, null, 2)
    )

    logger.success("Verification complete")

    logger.success("Pipeline finished successfully 🚀")

    return result

  } catch (error: any) {
    logger.error(`Pipeline failed: ${error.message}`)
    throw error
  }
}