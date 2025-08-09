import fs from "node:fs/promises"
import path from "node:path"

import type { Item } from "./types"

export default async function getAll(): Promise<Item[]> {
  const data = await fs.readFile(
    path.join(process.cwd(), "public", "all.json"),
    "utf8",
  )
  return JSON.parse(data)
}
