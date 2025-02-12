import axios from 'axios';
import * as vscode from 'vscode';

const DEEPFIX_API_KEY = process.env.DEEPFIX_API_KEY;

export class DeepSeekClient {
    private static instance: DeepSeekClient;

    private constructor() {}

    public static getInstance(): DeepSeekClient {
        if (!DeepSeekClient.instance) {
            DeepSeekClient.instance = new DeepSeekClient();
        }
        return DeepSeekClient.instance;
    }

    public async sendRequest(prompt: string): Promise<string> {
        try {
            const response = await axios.post('https://api.deepseek.com/v1/analyze', { prompt }, {
                headers: {
                    'Authorization': `Bearer ${DEEPFIX_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            return JSON.stringify(response.data, null, 2);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    vscode.window.showErrorMessage(`DeepSeek API Error: ${error.response.data}`);
                } else if (error.request) {
                    vscode.window.showErrorMessage('No response received from DeepSeek API');
                } else {
                    vscode.window.showErrorMessage('Error setting up request to DeepSeek API');
                }
            } else if (error instanceof Error) {
                vscode.window.showErrorMessage(`An unexpected error occurred: ${error.message}`);
            } else {
                vscode.window.showErrorMessage('An unexpected error occurred');
            }
            return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
}