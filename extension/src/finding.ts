import * as path from "path"
import * as vscode from "vscode"


export default class Finding {
    public static root = path.dirname(require.main!.filename)
    public static extension = "/tmp"
    public static encode = "utf-8"
    public static capacity = 5


    public static get cssFile(): string {
        const name = parseFloat(vscode.version) >= 1.38 ? "workbench.desktop.main.css" : "workbench.main.css"
        return path.join(this.root, "vs", "workbench", name)
    }

    public static get scriptPath(): string {
        return path.join(this.root, "vs", "code", "electron-browser", "workbench", "workbench.js")
    }

    public static get productFile(): string {
        return path.join(this.root, "..", "product.json")
    }

    public static get backupDirectory(): string {
        return path.join(this.extension, "backup", vscode.version)
    }

    public static get defaultRandom(): string {
        return path.join(this.extension, "media", "random")
    }

    public static get defaultStable(): string {
        return path.join(this.extension, "media", "stable", "default.png")
    }

    public static get activeDirectory(): string {
        return path.join(this.extension, "media", "active")
    }

    public static get updateImage(): string {
        return path.join(this.extension, "media", "active")
    }

    public static activeImage(i: number): string {
        return path.join(this.extension, "media", "active", `${i}.png`)
    }
}

