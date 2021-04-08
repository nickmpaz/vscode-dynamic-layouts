import * as vscode from 'vscode';

export async function setLayout() {
    let numGroups: number = vscode.window.visibleTextEditors.length;
    if (numGroups < 2) {
        return;
    }
    let masterPane = { groups: [{}], size: 0.5 }
    let stackPaneGroups = Array(numGroups - 1).fill(new Object);
    let stackPane = { groups: stackPaneGroups, size: 0.5 }
    let layout = { orientation: 0, groups: [masterPane, stackPane] }
    await vscode.commands.executeCommand('vscode.setEditorLayout', layout);
}

export async function focusNextGroup(this: vscode.ExtensionContext) {
    await vscode.commands.executeCommand('workbench.action.focusNextGroup');
}

export async function focusPreviousGroup() {
    await vscode.commands.executeCommand('workbench.action.focusPreviousGroup');
}

export async function swapNextGroup() {
    let numGroups: number = vscode.window.visibleTextEditors.length;
    let currViewColumn: vscode.ViewColumn | undefined = vscode.window.activeTextEditor?.viewColumn;
    if (numGroups < 2 || currViewColumn === undefined || currViewColumn === numGroups) {
        return;
    }
    if (currViewColumn === 1) {
        await vscode.commands.executeCommand('workbench.action.moveActiveEditorGroupDown');
        let currViewColumn: vscode.ViewColumn | undefined = vscode.window.activeTextEditor?.viewColumn;
        console.log({ currViewColumn })
        if (currViewColumn === undefined) {
            return;
        }
        while (currViewColumn > 2) {
            await vscode.commands.executeCommand('workbench.action.moveActiveEditorGroupUp');
            currViewColumn--;
        }
        setLayout();
    } else {
        await vscode.commands.executeCommand('workbench.action.moveActiveEditorGroupDown')
    }
}

export async function swapPreviousGroup() {
    let numGroups: number = vscode.window.visibleTextEditors.length;
    let currViewColumn: vscode.ViewColumn | undefined = vscode.window.activeTextEditor?.viewColumn;
    if (numGroups < 2 || currViewColumn === undefined || currViewColumn === 1) {
        return;
    } else {
        await vscode.commands.executeCommand('workbench.action.moveActiveEditorGroupUp')
        setLayout()
    }
}

export async function dynamicQuickOpen() {
    let numGroups: number = vscode.window.visibleTextEditors.length;
    if (numGroups > 0) {
        await vscode.commands.executeCommand('workbench.action.focusFirstEditorGroup');
        await vscode.commands.executeCommand('workbench.action.newGroupAbove');
        await vscode.commands.executeCommand('workbench.action.focusFirstEditorGroup');
        const uri = vscode.Uri.parse('vscode-dynamic-layouts:vscode-dynamic-layouts');
        const doc = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(doc, { preview: false });
        await setLayout();
    }
    await vscode.commands.executeCommand('workbench.action.quickOpen');
}

export async function closeGroup() {
    await vscode.commands.executeCommand('workbench.action.closeEditorsInGroup');
    await setLayout();
}