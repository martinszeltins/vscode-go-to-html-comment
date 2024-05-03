import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('go-to-html-comment.start', async () => {
        const editor = vscode.window.activeTextEditor;
        
        if (!editor) {
            return; // No open text editor
        }

        const text = editor.document.getText();
        const regex = /<!--(.*?)-->/gs;
        let match;
        const comments = [];

        while ((match = regex.exec(text)) !== null) {
            comments.push({
                label: `<!-- ${match[1].trim()} -->`,
                position: editor.document.positionAt(match.index)
            });
        }

        const updateSelection = (item: any, position: vscode.TextEditorRevealType = vscode.TextEditorRevealType.InCenter) => {
            editor.selection = new vscode.Selection(item.position, item.position);
            editor.revealRange(new vscode.Range(item.position, item.position), position);
        };

        const picked = await vscode.window.showQuickPick(comments, {
            placeHolder: 'Go to HTML comment...',
            onDidSelectItem: item => updateSelection(item, vscode.TextEditorRevealType.InCenter)
        });

        if (picked) {
            updateSelection(picked);
        }
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
