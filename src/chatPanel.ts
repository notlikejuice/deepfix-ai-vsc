import * as vscode from 'vscode';
import { askDeepSeek } from './deepseekClient';

export function createChatPanel(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        'deepfixChat',
        'DeepFix Chat',
        vscode.ViewColumn.Beside,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    // Pobierz listę aktualnie widocznych plików w edytorze
const openFiles = vscode.window.visibleTextEditors.map((editor: vscode.TextEditor) => editor.document.fileName);

    panel.webview.html = getChatPanelContent(openFiles);

    // Dodaj obsługę odbierania wiadomości z WebView
    panel.webview.onDidReceiveMessage(
        async (message) => {
            switch (message.command) {
                case 'sendPrompt':
                    const answer = await askDeepSeek(message.text);
                    panel.webview.postMessage({ command: 'displayAnswer', answer });
                    break;
                default:
                    console.warn(`Unknown command received: ${message.command}`);
            }
        },
        undefined,
        context.subscriptions
    );
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
