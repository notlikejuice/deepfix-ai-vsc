import * as vscode from 'vscode';
import * as fs from 'fs';
import * as ts from 'typescript';

export async function safeFileOperation(path: string, content: string): Promise<void> {
  const choice = await vscode.window.showWarningMessage(
    `Czy zatwierdzasz zmianę w pliku ${path}?`,
    { modal: true },
    'Tak', 'Nie'
  );
  if (choice === 'Tak') {
    await fs.promises.writeFile(path, content);
    vscode.window.showInformationMessage('Plik został zapisany');
  }
}

export function analyzeAST(sourceFile: ts.SourceFile): string[] {
  const diagnostics: string[] = [];
  ts.forEachChild(sourceFile, node => {
    if (ts.isFunctionDeclaration(node)) {
      diagnostics.push(`Znaleziono funkcję: ${node.name?.getText()}`);
    }
  });
  return diagnostics;
}

export function safeRegexSearch(content: string, pattern: string): RegExpMatchArray[] {
  try {
    const regex = new RegExp(pattern, 'gm');
    return [...content.matchAll(regex)];
  } catch (error) {
    vscode.window.showErrorMessage('Nieprawidłowe wyrażenie regularne');
    return [];
  }
}

export async function confirmAction(action: string): Promise<boolean> {
  return await vscode.window.showInformationMessage(
    `Czy chcesz wykonać akcję: ${action}?`,
    'Tak', 'Nie'
  ) === 'Tak';
}