import * as fs from "fs"
import * as vscode from "vscode"
import * as crypto from "crypto"
import Finding from "./finding"
import Modifier from "./modifier"

export default class Setup {

    public static install() {
        //check authorized
        if (!Modifier.authorized()) {
            return
        }
        try {
            //check modified
            if (Modifier.modified()) {
                //look backup
                const success = Modifier.restore()
                //not success restore try repair
                if (!success) {
                    Modifier.repair()
                    Modifier.checksum()
                }
            }
            //backup
            Modifier.backup()
            //insert
            Modifier.insertCSS()
            Modifier.insertJavaScript()
            //checksum
            Modifier.checksum()
            vscode.window.showInformationMessage("ふわふわ启用完毕(重新加载后生效) Fuwafuwa installed, reload window to work")
        } catch (error) {
            vscode.window.showErrorMessage(`ふわふわ启用失败(Fuwafuwa install failed)`)
        }
    }

    public static async library() {

        const files = await vscode.window.showOpenDialog({
            openLabel: "Select Library",
            filters: { "NodeJS": ["node"] }
        });

        const library = files?.shift()?.fsPath

        if (!library || !fs.existsSync(library)) {
            return
        }

        fs.copyFileSync(library, Finding.libraryFile)
        vscode.window.showInformationMessage("ふわふわ库文件已加载 Fuwafuwa library loaded")
    }

    public static uninstall() {
        //check authorized
        if (!Modifier.authorized()) {
            return
        }
        try {
            //check modified
            if (!Modifier.modified()) {
                vscode.window.showErrorMessage("ふわふわ未启用 Fuwafuwa is not installed")
                return
            }
            //look backup
            const success = Modifier.restore()

            //not success restore try repair
            if (!success) {
                Modifier.repair()
                Modifier.checksum()
            }
            vscode.window.showInformationMessage("ふわふわ已卸载(重新加载后生效) Fuwafuwa uninstalled, reload window to refresh")
        } catch (error) {
            vscode.window.showErrorMessage(`ふわふわ卸载失败(Fuwafuwa uninstall failed)`)
        }
    }

}