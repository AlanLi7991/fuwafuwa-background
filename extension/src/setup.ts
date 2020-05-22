import * as fs from "fs"
import * as vscode from "vscode"
import Finding from "./finding"
import Modifier from "./modifier"
import * as URL from "url"

export default class Setup {

    public static async install() {
        //check authorized
        if (!Modifier.authorized()) {
            return
        }

        try {
            //check modified
            if (Modifier.modified()) {
                const confirm = await vscode.window.showInformationMessage("ふわふわ已经安装 Fuwafuwa already installed", "更新 Update", "取消 Cancel")
                if (confirm === "取消 Cancel") {
                    return
                }
                Modifier.repair()
            } else {
                //backup
                Modifier.backup()
            }
            //insert
            this.insertCSS()
            this.insertJavaScript()
            //checksum
            Modifier.checksum()
        } catch (error) {
            vscode.window.showErrorMessage(`ふわふわ安装失败(Fuwafuwa install failed)`)
        }
        vscode.window.showInformationMessage("ふわふわ安装完毕(重新加载后生效) Fuwafuwa installed, reload window to work")
    }

    public static uninstall() {
        //check authorized
        if (!Modifier.authorized()) {
            return
        }
        try {
            //check modified
            if (!Modifier.modified()) {
                vscode.window.showErrorMessage("ふわふわ未安装 Fuwafuwa is not installed")
                return
            }
            //look backup
            const success = Modifier.restore()

            //not success restore try repair
            if (!success) {
                Modifier.repair()
                Modifier.checksum()
            }
        } catch (error) {
            vscode.window.showErrorMessage(`ふわふわ卸载失败(Fuwafuwa uninstall failed)`)
        }
        vscode.window.showInformationMessage("ふわふわ已卸载(重新加载后生效) Fuwafuwa uninstalled, reload window to refresh")
    }

    public static reinstall() {
        //check authorized
        if (!Modifier.authorized()) {
            return
        }
        try {
            //check modified
            if (Modifier.modified()) {
                Modifier.repair()
            } else {
                Modifier.backup()
            }
            //insert
            this.insertCSS()
            this.insertJavaScript()
            //checksum
            Modifier.checksum()
        } catch (error) {
            vscode.window.showErrorMessage(`ふわふわ安装失败(Fuwafuwa install failed)`)
        }
        vscode.window.showInformationMessage("ふわふわ安装完毕(重新加载后生效) Fuwafuwa installed, reload window to work")
    }

    private static insertCSS() {
        //location
        const location = Finding.cssFile

        //query style configuration
        const config = vscode.workspace.getConfiguration('fuwafuwa')
        const opacity = config.opacity
        const style = config.style

        //add start & remove background
        const content = fs.readFileSync(location, Finding.encode) + `
/*start-fuwafuwa-start*/

.lines-content.monaco-editor-background {
    background: none
}

[id="workbench.parts.editor"] .split-view-view .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element::before {
    content: ""; pointer-events: none; position: ${style.position};
    top: ${style.top}; right: ${style.right}; bottom: ${style.bottom}; left: ${style.left};
    width: ${style.width}; height: ${style.height}; opacity: ${opacity};
    background-size: contain;
    background-repeat: no-repeat;
    background-image: var(--update-image, url("${URL.pathToFileURL(Finding.activeImage(0))}?fuwafuwa=\${fuwafuwa.count}"));
    ${style.custom}
}

/*end-fuwafuwa-end*/
`
        fs.writeFileSync(Finding.cssFile, content, Finding.encode)
    }

    private static insertJavaScript() {
        //location
        const location = Finding.scriptFile

        //query style configuration
        const config = vscode.workspace.getConfiguration('fuwafuwa')
        const interval = config.interval * 1000

        //add start & remove update function
        let content = fs.readFileSync(location, Finding.encode) + `
//start-fuwafuwa-start

var fuwafuwa = { count: 0, update: null, interval: null}
fuwafuwa.update = () => {
    //update count
    fuwafuwa.count = fuwafuwa.count + 1
    //update image
    document.querySelectorAll(\`[id="workbench.parts.editor"] .split-view-view .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element\`).forEach((element, idx) => {
        element.style.setProperty('--update-image', \`url("${URL.pathToFileURL(Finding.updateImage)}/\${idx}.png?fuwafuwa=\${fuwafuwa.count}")\`);
    })
}
fuwafuwa.interval = setInterval(fuwafuwa.update, ${interval})

//end-fuwafuwa-end
`
        fs.writeFileSync(location, content, Finding.encode)
    }

}