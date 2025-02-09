import { Request, Response } from "express";

export async function handleOllamaRequest(req: Request, res: Response) {
  // Implement Ollama API handling logic here
  res.json({ message: "Ollama request received" });
}
