import * as vscode from 'vscode';
import { DeepSeekClient } from './api/deepseek';
import { DeepfixViewProvider } from './chatPanel';

export function activate(context: vscode.ExtensionContext) {
    console.log('✅ DeepFix AI Extension Activated');

    const provider = new DeepfixViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(DeepfixViewProvider.viewType, provider)
    );

    let disposable = vscode.commands.registerCommand('deepfix-ai.runAI', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const text = editor.document.getText(editor.selection);
        const response = await DeepSeekClient.getInstance().sendRequest(text);
        vscode.window.showInformationMessage(`DeepFix AI Response: ${response}`);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
