import * as vscode from "vscode";
import Background from "./background"
import Command from "./command"
import Finding from "./finding"


export function activate(context: vscode.ExtensionContext) {

	Finding.extension = context.extensionPath
	
	context.subscriptions.push(Command.install());
	context.subscriptions.push(Command.configure());
	context.subscriptions.push(Background.register())
}

export function deactivate() {}
