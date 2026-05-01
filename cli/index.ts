#!/usr/bin/env node

import { Command } from "commander"
import fs from "fs-extra"
import path from "path"

import { runPipeline } from "../core/orchestrator"

const program = new Command()

program
  .name("orka")
  .description("OrkaCLI — AI Multi-Agent Development Pipeline")
  .version("0.1.0")

// -----------------------------
// INIT COMMAND
// -----------------------------
program
  .command("init")
  .description("Initialize Orka in your project")
  .action(() => {
    const orkaDir = path.join(process.cwd(), ".orka")

    if (!fs.existsSync(orkaDir)) {
      fs.mkdirSync(orkaDir)
      console.log("✅ .orka directory created")
    } else {
      console.log("⚠️ .orka already exists")
    }

    const configPath = path.join(orkaDir, "config.json")

    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(
        configPath,
        JSON.stringify(
          {
            models: {
              spec: "gpt-4",
              implementation: "gpt-4",
              review: "gpt-4",
              fix: "gpt-4"
            },
            maxFixIterations: 2
          },
          null,
          2
        )
      )

      console.log("✅ config.json created")
    } else {
      console.log("⚠️ config.json already exists")
    }
  })

// -----------------------------
// IMPLEMENT COMMAND
// -----------------------------
program
  .command("implement <task>")
  .description("Run full pipeline to implement a feature")
  .action(async (task: string) => {
    console.log(`🚀 Starting Orka pipeline for task:\n"${task}"\n`)

    try {
      // TEMP placeholder until orchestrator is ready
      //   console.log("👉 Pipeline not yet implemented")
      await runPipeline(task)
      // Later:
      // await runPipeline(task)

    } catch (error) {
      console.error("❌ Pipeline failed:", error)
    }
  })



program
  .command("review")
  .description("Analyze generated code and identify issues")
  .action(async () => {
    console.log("🔍 Running review stage...\n")

    const { runReview } = await import("../review/agent")
    await runReview()
  })

  program
  .command("fix")
  .description("Apply fixes based on review output")
  .action(async () => {
    console.log("🛠 Running fix stage...\n")

    const { runFix } = await import("../fix/agent")
    await runFix()
  })


  program.parse(process.argv)
