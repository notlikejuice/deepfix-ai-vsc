import * as vscode from 'vscode';
import { demoBasicFunctionalities } from './codeFunctions';

async function askForApiKey() {
    const config = vscode.workspace.getConfiguration('deepfix');
    let apiKey = config.get<string>('apiKey');
    if (!apiKey) {
        apiKey = await vscode.window.showInputBox({
            prompt: 'Enter your DeepSeek API Key:',
            placeHolder: 'Enter API Key...',
            ignoreFocusOut: true,
            password: true
        });
        if (apiKey) {
            await config.update('apiKey', apiKey, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage('API Key saved.');
        } else {
            vscode.window.showWarningMessage('API Key is required for DeepFix to work.');
        }
    }
}

export async function activate(context: vscode.ExtensionContext) {
    console.log("DeepFix extension activated!");

    // Defer non-critical initialization
    const statusBarPromise = (async () => {
        await askForApiKey();

        // Create status bar item only after API key check
        const chatStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        chatStatusBarItem.text = 'DeepFix Chat';
        chatStatusBarItem.command = 'deepfix.openChat';
        chatStatusBarItem.show();
        context.subscriptions.push(chatStatusBarItem);
    })().catch(console.error);

    // Register providers immediately without awaiting
    const chatProvider = new ChatViewProvider(context);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('deepfixSidebar', chatProvider)
    );

    // Modify the command to reveal the sidebar view.
    context.subscriptions.push(
        vscode.commands.registerCommand('deepfix.openChat', () => {
            vscode.commands.executeCommand('workbench.view.extension.deepfixSidebar');
        })
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('deepfix.focusChat', () => {
            vscode.commands.executeCommand('workbench.view.extension.deepfixSidebar');
        })
    );

    let chatStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    chatStatusBarItem.text = 'DeepFix Chat';
    chatStatusBarItem.command = 'deepfix.openChat';
    chatStatusBarItem.show();
    context.subscriptions.push(chatStatusBarItem);
}

export function deactivate() { }

class ChatViewProvider implements vscode.WebviewViewProvider {
    constructor(private readonly context: vscode.ExtensionContext) { }

    resolveWebviewView(webviewView: vscode.WebviewView) {
        webviewView.webview.options = {
            enableScripts: true
        };
        const openFiles = vscode.window.visibleTextEditors.map(editor => editor.document.fileName);
        webviewView.webview.html = getChatPanelContent(openFiles);
    }
}

function getChatPanelContent(openFiles: string[]): string {
    const openFilesJson = JSON.stringify(openFiles);
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>DeepFix Chat</title>
            <script src="https://unpkg.com/vue@3"></script>
            <style>
                body {
                    font-family: sans-serif;
                    padding: 20px;
                }
                #app {
                    max-width: 600px;
                    margin: auto;
                }
                ul {
                    list-style-type: none;
                    padding: 0;
                }
                li {
                    background: #f4f4f4;
                    margin: 5px 0;
                    padding: 10px;
                    border-radius: 4px;
                }
            </style>
        </head>
        <body>
            <div id="app">
                <div class="chat-container">
                    <header>
                        <h1>DeepFix Chat</h1>
                        <h2>Aktualnie otwarte pliki:</h2>
                    </header>
                    <div id="chat-output" style="height: 300px; overflow:auto; border:1px solid #ccc; padding:10px; margin-bottom:10px;">
                        <!-- Chat messages will appear here -->
                    </div>
                    <div id="chat-input-container">
                        <input type="text" id="chat-input" placeholder="Wpisz wiadomość..." style="width:80%;" />
                        <button id="send-btn">Wyślij</button>
                    </div>
                </div>
                <ul>
                    <li v-for="file in openFiles" :key="file">{{ file }}</li>
                </ul>
            </div>
            <script>
                const vscode = acquireVsCodeApi();
                const input = document.getElementById('chat-input');
                const sendBtn = document.getElementById('send-btn');
                const output = document.getElementById('chat-output');
                function sendMessage() {
                    const message = input.value;
                    if (message.trim()) {
                        // Display user's message
                        const userMsg = document.createElement('div');
                        userMsg.textContent = 'Ty: ' + message;
                        output.appendChild(userMsg);
                        input.value = '';
                        // Send prompt to extension
                        vscode.postMessage({ command: 'sendPrompt', text: message });
                    }
                }
                sendBtn.addEventListener('click', sendMessage);
                input.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        sendMessage();
                    }
                });
                window.addEventListener('message', event => {
                    const message = event.data;
                    if (message.command === 'displayAnswer') {
                        const botMsg = document.createElement('div');
                        botMsg.textContent = 'DeepSeek: ' + message.answer;
                        output.appendChild(botMsg);
                    }
                });
            </script>
        </body>
        </html>
    `;
}
