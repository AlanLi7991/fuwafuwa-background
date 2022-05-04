import * as path from "path"
import * as vscode from "vscode"


export default class Finding {
    public static root = path.dirname(require.main!.filename)
    public static extension = "/extension"
    public static encode = "utf-8"
    public static capacity = 5


    /**
     * VSCode official file
     */
    public static get cssFile(): string {
        return path.join(this.root, "vs", "workbench", "workbench.desktop.main.css")
    }

    public static get scriptFile(): string {
        return path.join(this.root, "vs", "code", "electron-browser", "workbench", "workbench.js")
    }

    public static get productFile(): string {
        return path.join(this.root, "..", "product.json")
    }

    /**
     * Resource file
     */
    public static get libraryFile(): string {
        return path.join(this.extension, "addon", "FuwafuwaAddon.node")
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

    /**
     * Runtime file
     */
    public static get runtimeImage(): string {
        return path.join(this.root, "vs", "workbench", "fuwafuwa.png")
    }

}

