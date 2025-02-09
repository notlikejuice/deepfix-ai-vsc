import axios from "axios";
import { Request, Response } from "express";

export async function handleOpenAIRequest(req: Request, res: Response) {
  try {
    const { prompt } = req.body;
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: prompt }],
    }, {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "OpenAI request failed" });
  }
}
