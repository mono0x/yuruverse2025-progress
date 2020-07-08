import fs from "fs/promises"
import path from "path"

export default async function getAll() {
  const data = await fs.readFile(
    path.join(process.cwd(), "public", "all.json"),
    "utf8"
  )
  return JSON.parse(data)
}
