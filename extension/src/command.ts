import * as vscode from "vscode"
import Modifier from "./modifier"


enum Type { Single = "Single", Random = "Random", Custom = "Custom" }

class Configure implements vscode.QuickPickItem {
    constructor(public label: string, public description: string, public type: Type) { }
}
export default class Command {

    constructor(public context: vscode.ExtensionContext) { }

    public toggle() {
        //check authorized
        if (!Modifier.authorized()) {
            return
        }
        try {
            //check modified
            if (Modifier.modified()) {
                //not modified restore try repair
                Modifier.repair()
                Modifier.checksum()
                vscode.window.showInformationMessage("重启VSCode后还原 VSCode repaired need reopen")
            } else {
                //insert
                Modifier.insertCSS()
                Modifier.insertJavaScript()
                //checksum
                Modifier.checksum()
                vscode.window.showInformationMessage("重启VSCode后ふわふわ生效 Fuwafuwa injected need reopen vscode")
            }
            //show
        } catch (error) {
            vscode.window.showErrorMessage(`ふわふわ切换失败(Fuwafuwa switch failed)`)
        }
    }

    public configure() {
        const single = new Configure("$(file-media)  图片 Single", "配置固定背景图 (Configure stable background image)", Type.Single)
        const random = new Configure("$(sync)  随机 Random", "显示随机图片 (Use radom image)", Type.Random)
        const custom = new Configure("$(rocket)  自定义 Custom", "加载ふわふわ库文件 (Load ふわふわ library)", Type.Custom)
        const quickPick = vscode.window.createQuickPick()
        quickPick.items = [single, random, custom]
        quickPick.show()
        quickPick.onDidChangeSelection(async () => {
            const select = quickPick.selectedItems[0] as Configure
            vscode.workspace.getConfiguration('fuwafuwa').update("mode", select.type, vscode.ConfigurationTarget.Global)
            quickPick.dispose()
        })
    }

}