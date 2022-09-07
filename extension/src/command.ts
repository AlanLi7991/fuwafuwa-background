import * as vscode from "vscode"
import Manager from "./manager"
import Modifier from "./modifier"


enum Type { 
    Single = "Single", 
    Random = "Random", 
    Fuwafuwa = "Fuwafuwa", 
    Online = "Online"
}


enum Source { 
    Pixiv = "Pixiv", 
    Bing = "Bing",
    MovieDB = "MovieDB", 
    Unsplash = "Unsplash"
}

class Configure implements vscode.QuickPickItem {
    constructor(public label: string, public description: string, public key: string) { }
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
            if (error instanceof Error) {
                vscode.window.showWarningMessage(`${error.message}`)
            }
        }
    }

    public configure() {
        const single = new Configure("$(file-media)  图片 Single", "配置固定背景 (Configure stable background image)", Type.Single)
        const random = new Configure("$(sync)  随机 Random", "显示随机图片 (Use radom background image)", Type.Random)
        const quickPick = vscode.window.createQuickPick()
        quickPick.items = [single, random]
        quickPick.onDidChangeSelection(async (event) => {
            const select = event[0] as Configure
            if (select.key == Type.Single) {
                await Manager.selectImage()
                this.restart(Type.Single)
                quickPick.dispose()
            } else if (select.key == Type.Random) {
                quickPick.dispose()
                this.random()
            } 
        })
        quickPick.show()
    }

    private random() {
        const local = new Configure("本地 Local", "显示本地图片 (Use local path image)", Type.Random)
        const online = new Configure("在线 Online", "加载在线图源 (Load online image)", Type.Online)
        const quickPick = vscode.window.createQuickPick()
        quickPick.items = [local, online]
        quickPick.onDidChangeSelection(async (event) => {
            const select = event[0] as Configure
            quickPick.dispose()
            if (select.key == Type.Random) {
                this.local()
            } else if (select.key == Type.Online) {
                this.online()
            }
        })
        quickPick.show()
    }

    private local() {
        const folder = new Configure("文件夹 Folder", "随机循环文件夹 (Load folder image)", Type.Random)
        const fuwafuwa = new Configure("ふわふわ  Fuwafuwa", "ふわふわ文件夹 (Load ふわふわ image)", Type.Fuwafuwa)
        const quickPick = vscode.window.createQuickPick()
        quickPick.items = [folder, fuwafuwa]
        quickPick.onDidChangeSelection(async (event) => {
            const select = event[0] as Configure
            await Manager.selectFolder()
            this.restart(select.key)
            quickPick.dispose()
        })
        quickPick.show()
    }

    private online() {
        const pixiv = new Configure("Pixiv", "第三方Pixiv图源 (Unofficial pixiv sources)", Source.Pixiv)
        const bing = new Configure("Bing", "第三方Bing图源 (Unofficial bing sources)", Source.Bing)
        const movie = new Configure("MovieDB", "MovieDB电影图源 (The MovieDB official API of movies)", Source.MovieDB)
        const unsplash = new Configure("Unsplash ", "Unsplash图片库 (Unsplash official API of search)", Source.Unsplash)
        const onlinePick = vscode.window.createQuickPick()
        onlinePick.items = [pixiv, bing, movie, unsplash]
        onlinePick.onDidChangeSelection((event) => {
            const select = event[0] as Configure
            vscode.workspace.getConfiguration('fuwafuwa').update("source", select.key, vscode.ConfigurationTarget.Global)
            if (select.key == Source.Unsplash || select.key == Source.MovieDB) {
                this.query()
            } else {
                this.restart(Type.Online)
            }
            onlinePick.dispose()
        })
        onlinePick.show()
    }

    private query() {
        const input = vscode.window.createInputBox()
        input.placeholder = "请输入搜索关键词 Please input a key word for search"
        input.onDidAccept(()=> {
            vscode.workspace.getConfiguration('fuwafuwa').update("query", input.value, vscode.ConfigurationTarget.Global)
            this.restart(Type.Online)
            input.dispose()
        })
        input.show()
    }


    private restart(mode: String) {
        vscode.workspace.getConfiguration('fuwafuwa').update("mode", "", vscode.ConfigurationTarget.Global)
        vscode.workspace.getConfiguration('fuwafuwa').update("mode", mode, vscode.ConfigurationTarget.Global)
    }
}