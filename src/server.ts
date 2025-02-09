import express, { Request, Response } from "express";
import { handleOpenAIRequest } from "./api/openai";
import { handleDeepSeekRequest } from "./api/deepseek.js";
import { handleOllamaRequest } from "./api/ollama.js";
import { executeTerminalCommand } from "./utils/terminal.js";
import { readFile, writeFile } from "./utils/fileManager.js";

const app = express();
app.use(express.json());

app.post("/openai", handleOpenAIRequest);
app.post("/deepseek", handleDeepSeekRequest);
app.post("/ollama", handleOllamaRequest);

app.post("/terminal", async (req: Request, res: Response): Promise<void> => {
    const command = req.body.command;
    if (!command) {
        res.status(400).json({ error: "Command is required" });
        return;
    }
    const result = await executeTerminalCommand(command);
    res.json({ output: result });
});

app.get("/file", async (req: Request, res: Response): Promise<void> => {
    const path = req.query.path as string;
    if (!path) {
        res.status(400).json({ error: "File path is required" });
        return;
    }
    const content = await readFile(path);
    res.json({ content });
});

app.post("/file", async (req: Request, res: Response): Promise<void> => {
    const { path, content } = req.body;
    if (!path || !content) {
        res.status(400).json({ error: "Path and content are required" });
        return;
    }
    await writeFile(path, content);
    res.json({ status: "OK" });
});

app.listen(3000, () => console.log("DeepFix AI server running on port 3000"));
