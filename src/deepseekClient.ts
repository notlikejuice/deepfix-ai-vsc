import axios from 'axios';
import * as vscode from 'vscode';

export async function askDeepSeek(prompt: string): Promise<string> {
    const config = vscode.workspace.getConfiguration('deepfix');
    const apiKey = config.get<string>('apiKey');

    if (!apiKey) {
        vscode.window.showErrorMessage('API Key for DeepFix is not set.');
        return 'Error: No API Key';
    }
    const model = config.get<string>('model', 'deepseek-chat');
    const endpoint = model === "deepseek-reasoner" ? "https://api.deepseek.com/beta" : "https://api.deepseek.com/v1/chat/completions";

    try {
        const response = await axios.post(
            endpoint,
            {
                model: model,
                messages: [
                    { role: "system", content: "You are a helpful assistant" },
                    { role: "user", content: prompt }
                ],
                stream: false
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data && response.data.choices && response.data.choices.length > 0) {
            return response.data.choices[0].message.content;
        } else {
            throw new Error("Invalid API response");
        }
} catch (error: any) {
        vscode.window.showErrorMessage(`Error communicating with DeepSeek: ${error.message}`);
        return 'An error occurred.';
    }
}
