import * as vscode from "vscode"
import * as fs from "fs"
import * as path from "path"


export default class Image {

    private static processor?: any = undefined
    private config = vscode.workspace.getConfiguration('fuwafuwa'); //当前用户配置
    private source: string
    private cache: string
    public get cacheImage(): string {
        return this.cache
    }

    constructor(name: string) {
        this.source = path.join(this.config.folder, name)
        if (this.config.segment) {
            this.cache = path.join(this.config.cache, `${path.parse(name).name}_segment.png`)
        } else {
            this.cache = path.join(this.config.cache, `${path.parse(name).name}.png`)
        }
        if (Image.processor == undefined) {
            if (process.platform === "darwin") {
                Image.processor = require("bindings")("FuwafuwaAddon.darwin.node")
            } else if (process.platform === "win32") {
                Image.processor = require("bindings")("FuwafuwaAddon.win32.node")
            } else {
                this.config.update("segment", false, vscode.ConfigurationTarget.Global)
                vscode.window.showWarningMessage(`自动切图暂不支持当前操作系统 Segment not support current system`)
            }
        }
    }

    public async generateCache(): Promise<boolean> {
        if (this.config.segment) {
            return await this.segmentCache()
        } else {
            return await this.copyCache()
        }
    }

    private async segmentCache(): Promise<boolean> {
        const executor = (resolve: any) => {
            if (fs.existsSync(this.cache)) {
                resolve(true)
                return
            }
            const ret = Image.processor?.fuwafuwaImage(this.source, this.cache)
            resolve(ret == 0)
            if (ret != 0) {
                console.log(this.source + " not white image")
            }
        }
        return new Promise<boolean>(executor)
    }

    private async copyCache(): Promise<boolean> {
        const executor = (resolve: any) => {
            if (fs.existsSync(this.cache)) {
                resolve(true)
                return
            }
            fs.copyFile(this.source, this.cache, (err) => {
                resolve(!err)
            })
        }
        return new Promise<boolean>(executor)
    }

    public static validExtension(name: string): boolean {
        const ext = path.extname(name).toUpperCase()
        return ext === ".PNG" || ext === ".JPEG" || ext === ".JPG"
    }

}