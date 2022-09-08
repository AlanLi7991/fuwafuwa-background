import * as vscode from "vscode"
import * as fs from "fs"
import * as path from "path"
import Modifier from "./modifier"
import Processor from "./processor"
import Source from "./source"
import fetch from "node-fetch"
import { pipeline } from 'stream'
import { promisify } from 'util'

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
        if (mode === "Online") {
            return new Online(context)
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

    class Single extends Image {
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
    class Custom extends Image {

        private fallback = false
        private processor = new Processor(this.context)
        private sources: string[] = []

        public async load(): Promise<void> {
            if (this.processor.ready == false) {
                await this.processor.prepare()
            }
            
            let folder = vscode.workspace.getConfiguration('fuwafuwa').folder as string
            //default configuration use fallback
            if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) {
                folder = path.join(this.context.extensionPath, "resource", "random")
                this.fallback = true
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
            let processed = file
            if (this.fallback == false) {
                processed = await this.processor.native_fuwafuwa(file)
            }
            if (fs.existsSync(processed)) {
                fs.copyFileSync(processed, Modifier.runtimeImage)
            }
            this.sources.push(file)
        }

    }

    class Online extends Image {

        private folder = vscode.workspace.getConfiguration('fuwafuwa').folder as string
        private source = vscode.workspace.getConfiguration('fuwafuwa').source as string
        private queue = promisify(pipeline)
        private entries: Source.Entry[] = []
        private handler: Source.Handler | undefined = undefined
        private processor = new Processor(this.context)

        constructor(context: vscode.ExtensionContext) { 
            super(context)
        }

        public async load(): Promise<void> {
            if (this.processor.ready == false) {
                await this.processor.prepare()
            }
            this.handler = Source.instance()
            this.entries = await this.handler.request()
        }

        public async shift(): Promise<void> { 

            if (this.handler == undefined) {
                return
            }

            const entry = this.entries.shift()

            if (this.entries.length == 0) {
                this.load()
            }

            if (entry === undefined) {
                return
            }

            try {
                const response = await fetch(entry.url)
                if (response.ok == false) {
                    throw new Error(`HTTP Error Response: ${response.status} ${response.statusText}`)
                }
                await this.queue(response.body, fs.createWriteStream(Modifier.runtimeImage))
                
                let download = path.join(this.folder, this.source)

                if (["MovieDB", "Unsplash"].includes(this.source)) {
                    download = path.join(download, entry.folder)
                }
                if (fs.existsSync(download) == false || fs.statSync(download).isDirectory() == false) {
                    fs.mkdirSync(download, { recursive: true })
                }
                const file = path.join(download, entry.name)
                if (fs.existsSync(Modifier.runtimeImage) && !fs.existsSync(file)) {
                    fs.copyFileSync(Modifier.runtimeImage, file)
                }
            } catch (error) {
                if (error instanceof Error) {
                    vscode.window.showWarningMessage(`${error.message}`)
                }
            }
           
        }
    }


}

export default Manager