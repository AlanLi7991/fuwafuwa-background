import * as vscode from "vscode"
import * as fs from "fs"
import * as path from "path"
import * as crypto from "crypto"
import Image from "./image"
import Finding from "./finding";
import Manager from "./manager";

export class CustomRandom extends Manager {

    private skip_once = false
    private hash = "empty"
    private names: string[] = []
    private sequence: Image[] = []

    public load(): void {
        this.fillNames()
        this.fillSequence()
    }

    public shift(): void {
        if (this.skip_once) {
            vscode.window.showInformationMessage("ふわふわ数据读准备中 Fuwafuwa data preparing")
            this.skip_once = false
            return
        }

        //rename active images
        const first = this.sequence.shift()
        if (first) {
            fs.copyFileSync(first.cacheImage, Finding.runtimeImage)
        }

        //fill sequence for next loop
        this.fillSequence()
    }


    private fillSequence() {
        // recursive stop condition
        const full = this.sequence.length >= Finding.capacity
        if (full) {
            return
        }
        const empty = this.names.length == 0
        if (empty) {
            this.fillNames()
            return
        }
        //take next one
        const random = this.names.shift()!;
        const image = new Image(random)
        image.generateCache().then((success) => {
            if (success) {
                this.sequence.push(image)
            }
            //recursive
            this.fillSequence()
        })
    }

    private fillNames() {
        //lock first for shift
        this.skip_once = true
        //read 
        const folder = vscode.workspace.getConfiguration('fuwafuwa').folder
        const results = fs.readdirSync(folder).filter((s) => {
            return Image.validExtension(s)
        })
        //not empty
        if (results.length != 0) {
            //hash for finding image changed
            const content = results.reduce((prev, cur) => prev + cur)
            const md5 = crypto.createHash('md5').update(content).digest("base64").replace(/=+$/, "")
            //files change
            if (this.hash !== md5) {
                this.hash = md5
                this.names = results.sort(() => Math.random() - 0.5)
            }
        }
        this.skip_once = false
    }

    public static readyCheck() {
        const folder = vscode.workspace.getConfiguration('fuwafuwa').folder as string
        const cache = vscode.workspace.getConfiguration('fuwafuwa').cache as string
        const onlyFolder = folder.length == 0 && cache.length > 0
        const onlyCache = folder.length > 0 && cache.length == 0
        if (onlyFolder || onlyCache) {
            vscode.window.showWarningMessage(`自定义随机模式需要同时配置目录和缓存文件夹(CustomRandom mode need both folder and cache settings)`)
        }
    }

}

export class CustomStable extends Manager {

    load(): void {
        const background = vscode.workspace.getConfiguration('fuwafuwa').image
        const image = new Image(background, false)
        image.generateCache().then((success) => {
            const source = success ? image.cacheImage : background
            fs.copyFileSync(source, Finding.runtimeImage)
        })

    }

}
