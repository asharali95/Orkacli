import fs from "fs"
import path from "path"

const logFilePath = path.join(process.cwd(), ".orka", "logs.txt")

function writeToFile(message: string) {
  try {
    fs.appendFileSync(logFilePath, message + "\n")
  } catch {
    // fail silently (don’t crash app)
  }
}

function timestamp() {
  return new Date().toISOString()
}

export const logger = {
  info(message: string) {
    const msg = `[INFO] ${timestamp()} - ${message}`
    console.log(msg)
    writeToFile(msg)
  },

  error(message: string) {
    const msg = `[ERROR] ${timestamp()} - ${message}`
    console.error(msg)
    writeToFile(msg)
  },

  success(message: string) {
    const msg = `[SUCCESS] ${timestamp()} - ${message}`
    console.log(msg)
    writeToFile(msg)
  }
}