import * as vscode from "vscode"
import * as fs from "fs"
import Manager from "./manager"
import { InnerRandom, InnerStable } from "./inner"
import { CustomRandom, CustomStable } from "./custom"
import Image from "./image"
import Finding from "./finding"
import Modifier from "./modifier"
import Setup from "./setup"

export default class Background {

    public static register(): vscode.Disposable {
        // check working
        if (!Modifier.modified()) {
            vscode.window.showInformationMessage("ふわふわ当前未启用 Fuwafuwa need activate", "启用 Activate", "隐藏 Hidden").then(selection => {
                if (selection == "启用 Activate") {
                    Setup.activate()
                }
            })
        } else {
            Background.start()
        }

        // return disposable
        return vscode.workspace.onDidChangeConfiguration((event) => {
            // stop first
            Background.stop()

            // if change style/interval/opacity show information
            const style = event.affectsConfiguration("fuwafuwa.style")
            const interval = event.affectsConfiguration("fuwafuwa.interval")
            const opacity = event.affectsConfiguration("fuwafuwa.opacity")
            if (interval || style || opacity) {
                vscode.window.showInformationMessage("ふわふわ需重新启用 Fuwafuwa need reinstall to activate")
                return
            }

            // if change path of folder/image, then check cache
            const folder = event.affectsConfiguration("fuwafuwa.folder")
            const image = event.affectsConfiguration("fuwafuwa.image")
            if (folder || image) {
                const cache = vscode.workspace.getConfiguration('fuwafuwa').cache as string
                if (cache.length == 0) {
                    vscode.window.showWarningMessage(`自定义模式需要配置缓存文件夹(Custom mode need cache settings)`)
                }
            }

            Background.start()
        });
    }

    private static manager?: Manager
    private static interval?: NodeJS.Timeout

    public static start() {
        //stop
        Background.stop()

        // check hidden
        const hidden = vscode.workspace.getConfiguration('fuwafuwa').hidden ?? true
        if (hidden) {
            return
        }

        //reload
        Background.reload()
    }

    public static stop() {
        //invalid first
        clearInterval(Background.interval!)
        Background.manager = undefined
        Background.interval = undefined
        //clean
        if (fs.existsSync(Finding.runtimeImage)) {
            fs.unlinkSync(Finding.runtimeImage)
        }
    }

    private static reload() {
        // check use random or stable
        const random = vscode.workspace.getConfiguration('fuwafuwa').random ?? true
        if (random) {
            // create manager by fallback flag
            const fallback = Background.fallbackRandom()
            Background.manager = fallback ? new InnerRandom() : new CustomRandom()
        } else {
            // create manager by fallback flag
            const fallback = Background.fallbackStable()
            Background.manager = fallback ? new InnerStable() : new CustomStable()
        }

        //load data
        try {

            Background.manager?.load()
            Background.manager?.shift()
        } catch (error) {
            vscode.window.showWarningMessage(`${error.message}`)
        }

        //init interval
        Background.interval = setInterval(() => {
            try {
                Background.manager?.shift()
            } catch (error) {
                vscode.window.showWarningMessage(`${error.message}`)
            }
        }, (vscode.workspace.getConfiguration('fuwafuwa').interval ?? 10) * 900)
    }


    private static fallbackRandom(): boolean {
        const folder = vscode.workspace.getConfiguration('fuwafuwa').folder as string
        const cache = vscode.workspace.getConfiguration('fuwafuwa').cache as string

        //1. default configuration use fallback
        if (!folder || folder.length === 0) {
            return true
        }
        //2. wrong configuration use fallback too
        if (!fs.existsSync(folder)) {
            vscode.window.showWarningMessage(`${folder} 文件夹路径不存在(folder configuration is not exist)`)
            return true
        }
        if (!fs.statSync(folder).isDirectory()) {
            vscode.window.showWarningMessage(`${folder} 文件夹路径不是目录(folder configuration is not directory)`)
            return true
        }
        if (!fs.existsSync(cache)) {
            vscode.window.showWarningMessage(`${cache} 缓存路径不存在(cache configuration is not exist)`)
            return true
        }
        if (!fs.statSync(cache).isDirectory()) {
            vscode.window.showWarningMessage(`${cache} 缓存路径不是文件夹(cache configuration is not directory)`)
            return true
        }
        // all check valid 
        return false
    }

    private static fallbackStable(): boolean {
        const image = vscode.workspace.getConfiguration('fuwafuwa').image as string
        const cache = vscode.workspace.getConfiguration('fuwafuwa').cache as string

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
        if (!fs.existsSync(cache)) {
            vscode.window.showWarningMessage(`${cache} 缓存路径不存在(cache configuration is not exist)`)
            return true
        }
        if (!fs.statSync(cache).isDirectory()) {
            vscode.window.showWarningMessage(`${cache} 缓存路径不是文件夹(cache configuration is not directory)`)
            return true
        }
        // all check valid 
        return false
    }
}