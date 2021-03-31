import * as vscode from 'vscode';

export async function setLayout({ fromQuickOpen = false }: { fromQuickOpen?: boolean } = {}) {
    let numGroups: number = vscode.window.visibleTextEditors.length;
    if (fromQuickOpen) {
        numGroups += 1;
    }
    if (numGroups < 2) {
        return;
    }
    let masterPane = { groups: [{}], size: 0.5 }
    let stackPaneGroups = Array(numGroups - 1).fill(new Object);
    let stackPane = { groups: stackPaneGroups, size: 0.5 }
    let layout = { orientation: 0, groups: [masterPane, stackPane] }
    await vscode.commands.executeCommand('vscode.setEditorLayout', layout);
}

export function focusNextGroup() {
    vscode.commands.executeCommand('workbench.action.focusNextGroup');
}

export function focusPreviousGroup() {
    vscode.commands.executeCommand('workbench.action.focusPreviousGroup');
}

export async function swapNextGroup() {
    let numGroups: number = vscode.window.visibleTextEditors.length;
    if (numGroups < 2) {
        return;
    }
    let currViewColumn: vscode.ViewColumn | undefined = vscode.window.activeTextEditor?.viewColumn;
    if (currViewColumn === undefined || currViewColumn === numGroups) {
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
    if (numGroups < 2) {
        return;
    }
    let currViewColumn: vscode.ViewColumn | undefined = vscode.window.activeTextEditor?.viewColumn;
    if (currViewColumn === undefined || currViewColumn === 1) {
        return;
    }
    if (currViewColumn === 2) {
        await vscode.commands.executeCommand('workbench.action.moveActiveEditorGroupLeft');
        setLayout();
    } else {
        vscode.commands.executeCommand('workbench.action.moveActiveEditorGroupUp')
    }
}

export async function dynamicQuickOpen() {
    await vscode.commands.executeCommand('workbench.action.focusFirstEditorGroup');
    await vscode.commands.executeCommand('workbench.action.newGroupAbove');
    await vscode.commands.executeCommand('workbench.action.quickOpen');
}