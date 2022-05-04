import * as vscode from "vscode"
import * as fs from "fs"
import Setting from "./setting"
import Setup from "./setup"
import Background from "./background"


export default class Command {

    public static install(): vscode.Disposable {
        return vscode.commands.registerCommand("fuwafuwa.activate", () => {
            Setup.activate()
            Background.start()
        })
    }

    public static configure(): vscode.Disposable {
        return vscode.commands.registerCommand("fuwafuwa.configure", () => {

            const quickPick = vscode.window.createQuickPick()
            quickPick.items = Setting.Item.list()
            quickPick.show()
            quickPick.onDidChangeSelection(async () => {
                const select = quickPick.selectedItems[0] as Setting.Item
                const config = vscode.workspace.getConfiguration('fuwafuwa');
                if (select) {
                    switch (select.type) {
                        case Setting.Type.Hidden:
                            config.update("hidden", !config.hidden, vscode.ConfigurationTarget.Global)
                            break
                        case Setting.Type.Random:
                            config.update("random", !config.random, vscode.ConfigurationTarget.Global)
                            break
                        case Setting.Type.Segment:
                            config.update("segment", !config.segment, vscode.ConfigurationTarget.Global)
                            break
                        case Setting.Type.Image:
                            const imagePath = await this.selectPath(false)
                            config.update("image", imagePath, vscode.ConfigurationTarget.Global)
                            break
                        case Setting.Type.Folder:
                            const folderPath = await this.selectPath(true)
                            config.update("folder", folderPath, vscode.ConfigurationTarget.Global)
                            break
                        case Setting.Type.Cache:
                            const cachePath = await this.selectPath(true)
                            config.update("cache", cachePath, vscode.ConfigurationTarget.Global)
                            break
                        case Setting.Type.Library:
                            Setup.library()
                            break
                        case Setting.Type.Deactivate:
                            Background.stop()
                            Setup.deactivate()
                            break
                    }
                }
                quickPick.dispose()
            })
        })
    }

    private static async selectPath(folder: boolean): Promise<fs.PathLike> {
        const dir = await vscode.window.showOpenDialog({
            canSelectFolders: folder,
            canSelectFiles: !folder,
            canSelectMany: false,
            openLabel: folder ? "Select Folder" : "Select Image",
            filters: { "Images": ["png", "jpg", "jpeg"] }
        });

        return dir?.shift()?.fsPath ?? ""
    }
}