import * as vscode from "vscode"
import * as fs from "fs"
import Manager from "./manager"
import { InnerRandom, InnerStable } from "./inner"
import { CustomRandom, CustomStable } from "./custom"
import Image from "./image"
import Finding from "./finding"

export default class Background {

    public static register(): vscode.Disposable {
        const background = new Background();
        background.reload()
        return vscode.workspace.onDidChangeConfiguration((event) => {
            background.stop()

            const style = event.affectsConfiguration("fuwafuwa.style")
            const interval = event.affectsConfiguration("fuwafuwa.interval")
            const opacity = event.affectsConfiguration("fuwafuwa.opacity")
            if (interval || style || opacity) {
                vscode.window.showInformationMessage("ふわふわ重装后生效 Fuwafuwa need reinstall to activate")
                return
            }
            const random = event.affectsConfiguration("fuwafuwa.random")
            if (random) {
                Manager.clean()
            }

            const folder = event.affectsConfiguration("fuwafuwa.folder")
            const cache = event.affectsConfiguration("fuwafuwa.cache")
            if (folder || cache) {
                CustomRandom.readyCheck()
            }

            background.reload()
        });
    }

    private manager?: Manager
    private interval?: NodeJS.Timeout


    private reload() {
        //stop
        this.stop()

        // check hidden
        const hidden = vscode.workspace.getConfiguration('fuwafuwa').hidden ?? true
        if (hidden) {
            return
        }

        //start
        this.start()
    }

    private stop() {
        //invalid first
        clearInterval(this.interval!)
        this.manager = undefined
        this.interval = undefined
    }

    private start() {
        // check use random or stable
        const random = vscode.workspace.getConfiguration('fuwafuwa').random ?? true
        if (random) {
            // create manager by fallback flag
            const fallback = this.fallbackRandom()
            this.manager = fallback ? new InnerRandom() : new CustomRandom()
        } else {
            // create manager by fallback flag
            const fallback = this.fallbackStable()
            this.manager = fallback ? new InnerStable() : new CustomStable()
        }

        //load data
        try {
            if (!fs.existsSync(Finding.activeDirectory)) {
                fs.mkdirSync(Finding.activeDirectory, { recursive: true })
            }
            this.manager?.load()
            this.manager?.shift()
        } catch (error) {
            vscode.window.showWarningMessage(`加载数据出错，请检查配置(Load image error, check configurations)`)
        }

        //init interval
        this.interval = setInterval(() => {
            try {
                this.manager?.shift()
            } catch (error) {
                vscode.window.showWarningMessage(`切换背景图出错，请检查配置(Image shift error, check configurations)`)
            }
        }, (vscode.workspace.getConfiguration('fuwafuwa').interval ?? 10) * 900)
    }


    private fallbackRandom(): boolean {
        const folder = vscode.workspace.getConfiguration('fuwafuwa').folder as string
        const cache = vscode.workspace.getConfiguration('fuwafuwa').cache as string
        const directory = [folder, cache]
        // check configurations
        for (let i = 0; i < directory.length; i++) {
            const element = directory[i];
            //1. default configuration use fallback
            if (!element || element.length === 0) {
                return true
            }
            //2. wrong configuration use fallback too
            if (!fs.existsSync(element)) {
                vscode.window.showWarningMessage(`${element} 文件夹路径不存在(folder configuration is not exist)`)
                return true
            }
            if (!fs.statSync(element).isDirectory()) {
                vscode.window.showWarningMessage(`${element} 路径不是文件夹(configuration is not directory)`)
                return true
            }
        }
        // all check valid 
        return false
    }

    private fallbackStable(): boolean {
        const image = vscode.workspace.getConfiguration('fuwafuwa').image as string

        //1. default configuration use fallback
        if (!image || image.length === 0) {
            return true
        }
        //2. wrong configuration use fallback too
        if (!fs.existsSync(image)) {
            vscode.window.showWarningMessage(`${image}图片路径不存在(image configuration is not exist)`)
            return true
        }
        if (!fs.statSync(image).isFile()) {
            vscode.window.showWarningMessage(`${image}路径不是文件(image configuration is not file)`)
            return true
        }
        if (!Image.validExtension(image)) {
            vscode.window.showWarningMessage(`${image}图片格式仅支持PNG、JPG(image extension supports PNG & JPG only)`)
            return true
        }
        // all check valid 
        return false
    }
}