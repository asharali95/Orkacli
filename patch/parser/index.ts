export interface PatchFile {
    filePath: string
    changes: string[]
  }
  
  export function parseDiff(diff: string): PatchFile[] {
    const lines = diff.split("\n")
  
    const patches: PatchFile[] = []
    let currentFile: PatchFile | null = null
  
    for (const line of lines) {
      // Detect file start
      if (line.startsWith("+++ b/")) {
        const filePath = line.replace("+++ b/", "").trim()
  
        currentFile = {
          filePath,
          changes: []
        }
  
        patches.push(currentFile)
      }
  
      // Capture added lines only (V1 simplification)
      else if (currentFile && line.startsWith("+") && !line.startsWith("+++")) {
        currentFile.changes.push(line.slice(1)) // remove "+"
      }
    }
  
    return patches
  }