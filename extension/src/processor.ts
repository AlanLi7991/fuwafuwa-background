import * as vscode from "vscode"
import * as fs from "fs"
import * as path from "path"
import { getApi, FileDownloader } from "@microsoft/vscode-file-downloader-api";


export default class Processor {

    public ready = false
    private addon: string = path.join(this.context.extensionPath, "resource", "FuwafuwaAddon.node")
    private native: any = undefined

    constructor(public context: vscode.ExtensionContext) { }


    public async prepare(): Promise<boolean> {
        const executor = async (resolve: any, reject: any) => {
            if (process.platform !== "darwin" && process.platform !== "win32") {
                vscode.window.showWarningMessage(`自动切图暂不支持当前操作系统 Segment not support current system`)
                resolve(false)
                return
            }

            if (fs.existsSync(this.addon) == false) {
                let file: vscode.Uri | undefined

                await vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: "下载Fuwafuwa库文件 Download Util FuwafuwaAddon.node",
                    cancellable: true
                }, async (progress, token)=> {
                    
                    const downloading = (downloadedBytes: number, totalBytes: number | undefined) => {
                        progress.report({
                            message: `Downloaded ${downloadedBytes}/${totalBytes} bytes`,
                        })
                    }
    
                    const fileDownloader: FileDownloader = await getApi()
                    file = await fileDownloader.downloadFile(
                        vscode.Uri.parse(`https://github.com/AlanLi7991/fuwafuwa-background/raw/master/resource/addon/${process.platform}/FuwafuwaAddon.node`),
                        "FuwafuwaAddon.node",
                        this.context,
                        token,
                        downloading, {
                            timeoutInMs: 1000*60*10, //10mins
                            retries: 1000 
                        }
                    )
                })            

                if (file != undefined && fs.existsSync(file.fsPath)) {
                    fs.copyFileSync(file.fsPath, this.addon)
                    vscode.window.showInformationMessage("ふわふわ库文件已加载 Fuwafuwa library loaded")
                } else {
                    resolve(false)
                    return
                }
            }

            try {
                this.native = require(this.addon)
                this.ready = true
                resolve(true)
            } catch (error) {
                if (error instanceof Error) {
                    vscode.window.showWarningMessage(`${error.message}`)
                }
                resolve(false)
            }
        }
        return new Promise<boolean>(executor)
    }

    public async native_fuwafuwa(image: string): Promise<string> {

        const executor = (resolve: any) => {

            if (this.native == undefined || !fs.existsSync(image)) {
                resolve(image)
            }

            const parsed = path.parse(image)
            const dest = path.join(parsed.dir, `fuwafuwa_${parsed.name}.png`)

            if (fs.existsSync(dest)) {
                resolve(dest)
                return
            }
            const ret = this.native?.fuwafuwaImage(image, dest)
            if (ret == 0) {
                resolve(dest)
            } else {
                resolve(image)
                console.log(image + " could not be processed")
            }
        }
        return new Promise<string>(executor)
    }

}