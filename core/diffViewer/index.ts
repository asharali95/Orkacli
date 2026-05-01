import { createPatch } from "diff"

export function generatePreview(original: string, updated: string, filePath: string) {
  return createPatch(filePath, original, updated)
}