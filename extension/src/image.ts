import * as vscode from "vscode"
import * as fs from "fs"
import * as path from "path"
import Finding from "./finding";


export default class Image {

    private static processor?: any = undefined
    private config = vscode.workspace.getConfiguration('fuwafuwa'); //当前用户配置
    private source: string
    private cache: string
    public get cacheImage(): string {
        return this.cache
    }

    constructor(name: string, folder: boolean = true) {
        this.source = folder ? path.join(this.config.folder, name) : name
        if (this.config.segment) {
            this.cache = path.join(this.config.cache, `${path.parse(name).name}_segment.png`)
            this.lazyLoadAddon()
        } else {
            this.cache = path.join(this.config.cache, `${path.parse(name).name}.png`)
        }
    }

    public async generateCache(): Promise<boolean> {
        if (this.config.segment) {
            return await this.segmentCache()
        } else {
            return await this.copyCache()
        }
    }

    public static validExtension(name: string): boolean {
        const ext = path.extname(name).toUpperCase()
        return ext === ".PNG" || ext === ".JPEG" || ext === ".JPG"
    }

    private lazyLoadAddon() {
        if (Image.processor) {
            return
        }
        if (process.platform !== "darwin" && process.platform !== "win32") {
            this.config.update("segment", false, vscode.ConfigurationTarget.Global)
            vscode.window.showWarningMessage(`自动切图暂不支持当前操作系统 Segment not support current system`)
            return
        }
        if (fs.existsSync(Finding.libraryFile)) {
            Image.processor = require(Finding.libraryFile)
            return
        }
        vscode.window.showWarningMessage(
            `ふわふわ自定义模式需要库文件 Fuwafuwa custom mode need library file` +
            `(https://github.com/AlanLi7991/fuwafuwa-background/tree/master/resource/addon/${process.platform}/FuwafuwaAddon.node)`
        )
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

}