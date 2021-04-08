import * as vscode from 'vscode';
import { setLayout, focusNextGroup, focusPreviousGroup, swapNextGroup, swapPreviousGroup, dynamicQuickOpen, closeGroup } from './layout';

const myScheme = "vscode-dynamic-layouts";
const myProvider = new (class implements vscode.TextDocumentContentProvider {
	provideTextDocumentContent(uri: vscode.Uri): string {
		return "";
	}
})();

vscode.workspace.registerTextDocumentContentProvider(myScheme, myProvider);


export function activate(context: vscode.ExtensionContext) {
	registerCommand(context, 'vscode-dynamic-layouts.setLayout', setLayout);
	registerCommand(context, 'vscode-dynamic-layouts.focusNextGroup', focusNextGroup);
	registerCommand(context, 'vscode-dynamic-layouts.focusPreviousGroup', focusPreviousGroup);
	registerCommand(context, 'vscode-dynamic-layouts.swapNextGroup', swapNextGroup);
	registerCommand(context, 'vscode-dynamic-layouts.swapPreviousGroup', swapPreviousGroup);
	registerCommand(context, 'vscode-dynamic-layouts.dynamicQuickOpen', dynamicQuickOpen);
	registerCommand(context, 'vscode-dynamic-layouts.closeGroup', closeGroup);
}

function registerCommand(context: vscode.ExtensionContext, commandId: string, handler: () => void | Promise<void>) {
	let disposable = vscode.commands.registerCommand(commandId, handler, context);
	context.subscriptions.push(disposable);
}

export function deactivate() {}
