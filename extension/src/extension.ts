import * as vscode from "vscode"
import Engine from "./engine"
import Command from "./command"
import Modifier from "./modifier"


namespace fuwafuwa {
	export let engine: Engine | undefined = undefined
	export let command: Command | undefined = undefined
}

export function activate(context: vscode.ExtensionContext) {

	fuwafuwa.engine = new Engine(context)
	fuwafuwa.command = new Command(context)

	context.subscriptions.push(vscode.commands.registerCommand("fuwafuwa.toggle", fuwafuwa.command.toggle, fuwafuwa.command))
	context.subscriptions.push(vscode.commands.registerCommand("fuwafuwa.configure", fuwafuwa.command.configure, fuwafuwa.command))
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(fuwafuwa.engine.update, fuwafuwa.engine))
	context.subscriptions.push(vscode.window.onDidChangeWindowState(fuwafuwa.engine.pause, fuwafuwa.engine))

	try {
		// check working
		if (!Modifier.modified()) {
			vscode.window.showInformationMessage("ふわふわ未注入 Fuwafuwa need toggle", "启用 Activate", "忽略 Ignore").then(selection => {
				if (selection == "启用 Activate") {
					fuwafuwa.command?.toggle()
				}
			})
		} else {
			fuwafuwa.engine?.start()
		}
	} catch (error) {
		if (error instanceof Error) {
			vscode.window.showWarningMessage(`${error.message}`)
		}
	}
}

export function deactivate() {
	fuwafuwa.engine = undefined
	fuwafuwa.command = undefined
}

