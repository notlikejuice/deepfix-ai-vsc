import fs from "fs/promises";
import path from "path";

const storageDir = path.join(process.env.HOME || process.env.USERPROFILE || ".", ".deepfix-ai");

export async function readFile(filePath: string) {
  try {
    return await fs.readFile(path.join(storageDir, filePath), "utf8");
  } catch {
    return null;
  }
}

export async function writeFile(filePath: string, content: string) {
  await fs.mkdir(storageDir, { recursive: true });
  await fs.writeFile(path.join(storageDir, filePath), content, "utf8");
}
