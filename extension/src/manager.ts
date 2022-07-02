import * as vscode from "vscode"
import * as fs from "fs"
import * as path from "path"
import Modifier from "./modifier"
import { getApi, FileDownloader } from "@microsoft/vscode-file-downloader-api";
import Processor from "./processor"

namespace Manager {

    export function instance(context: vscode.ExtensionContext): Image {
        // check use random or stable
        const mode = vscode.workspace.getConfiguration('fuwafuwa').mode ?? "Random"
        if (mode === "Single") {
            return new Single(context)
        }
        if (mode === "Fuwafuwa") {
            return new Custom(context)
        }
        return new Random(context)
    }

    export async function selectImage() {
        const selected = await vscode.window.showOpenDialog({
            openLabel: "Select Fuwafuwa Image",
            filters: { "Images": ["png", "jpg", "jpeg"] }
        });
        let image = selected?.shift()?.fsPath ?? ""
        if (image.length > 0) {
            vscode.workspace.getConfiguration('fuwafuwa').update("image", image, vscode.ConfigurationTarget.Global)
        }
    }

    export async function selectFolder() {
        const selected = await vscode.window.showOpenDialog({
            canSelectFolders: true,
            canSelectFiles: false,
            canSelectMany: false,
            openLabel: "Select Folder"
        })
        let folder = selected?.shift()?.fsPath ?? ""
        if (folder.length > 0) {
            vscode.workspace.getConfiguration('fuwafuwa').update("folder", folder, vscode.ConfigurationTarget.Global)
        }
    }

    export class Image {

        constructor(public context: vscode.ExtensionContext) { }

        static validExtension(name: string): boolean {
            const ext = path.extname(name).toUpperCase()
            return ext === ".PNG" || ext === ".JPEG" || ext === ".JPG"
        }

        public async load(): Promise<void> { }
        public async shift(): Promise<void> { }
    }

    export class Single extends Image {
        public async load(): Promise<void> {
            let image = vscode.workspace.getConfiguration('fuwafuwa').image as string
            //1. default configuration use fallback
            if (!fs.existsSync(image) || !fs.statSync(image).isFile() || !Image.validExtension(image)) {
                image = path.join(this.context.extensionPath, "resource", "default.png")
            }
            fs.copyFileSync(image, Modifier.runtimeImage)
        }
    }

    class Random extends Image {
        private images: string[] = []

        public async load(): Promise<void> {
            let folder = vscode.workspace.getConfiguration('fuwafuwa').folder as string
            //default configuration use fallback
            if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) {
                folder = path.join(this.context.extensionPath, "resource", "random")
            }
            //query
            this.images = fs.readdirSync(folder).filter((s) => {
                return Image.validExtension(s) && !s.startsWith("fuwafuwa_")
            }).sort(() => Math.random() - 0.5).map(file => path.join(folder, file))
        }

        public async shift(): Promise<void> {
            const file = this.images.shift()
            if (file != undefined && fs.existsSync(file)) {
                fs.copyFileSync(file, Modifier.runtimeImage)
                this.images.push(file)
            }
        }
    }
    export class Custom extends Image {

        private processor: Processor | undefined = undefined
        private addon: string = path.join(this.context.extensionPath, "resource", "FuwafuwaAddon.node")
        private sources: string[] = []

        private async prepare(): Promise<boolean> {

            if (process.platform !== "darwin" && process.platform !== "win32") {
                vscode.window.showWarningMessage(`自动切图暂不支持当前操作系统 Segment not support current system`)
                return false
            }

            if (fs.existsSync(this.addon)) {
                return true
            }

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
                return true
            }
            return false
        }

        public async load(): Promise<void> {
            const prepared = await this.prepare()

            if (prepared && this.processor == undefined) {
                this.processor = new Processor(this.addon)
            }

            let folder = vscode.workspace.getConfiguration('fuwafuwa').folder as string
            //default configuration use fallback
            if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) {
                folder = path.join(this.context.extensionPath, "resource", "random")
                this.processor = undefined
            }
            //query
            this.sources = fs.readdirSync(folder).filter((s) => {
                return Image.validExtension(s) && !s.startsWith("fuwafuwa_")
            }).sort(() => Math.random() - 0.5).map(file => path.join(folder, file))

        }

        public async shift(): Promise<void> {
            const file = this.sources.shift()

            if (file === undefined || !fs.existsSync(file)) {
                return
            }

            const processed = await this.processor?.generateCache(file) || file
            if (fs.existsSync(processed)) {
                fs.copyFileSync(processed, Modifier.runtimeImage)
            }
            this.sources.push(file)
        }

    }

}

export default Manager