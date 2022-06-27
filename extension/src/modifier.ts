import * as fs from "fs"
import * as path from "path"
import * as vscode from "vscode"
import * as crypto from "crypto"



export default class Modifier {

    static root = path.dirname(require.main!.filename)
    static encode = "utf-8"

    /**
     * VSCode official file
     */
    static get cssFile(): string {
        return path.join(this.root, "vs", "workbench", "workbench.desktop.main.css")
    }

    static get scriptFile(): string {
        return path.join(this.root, "vs", "code", "electron-browser", "workbench", "workbench.js")
    }

    static get productFile(): string {
        return path.join(this.root, "..", "product.json")
    }
    /**
     * Runtime file
     */
    static get runtimeImage(): string {
        return path.join(this.root, "vs", "workbench", "fuwafuwa.png")
    }

    public static clean() {
        if (fs.existsSync(Modifier.runtimeImage)) {
            fs.unlinkSync(Modifier.runtimeImage)
        }
    }

    public static repair() {

        let content = fs.readFileSync(this.scriptFile, Modifier.encode)
        content = content.replace(/\/\/start-fuwafuwa-start[\s\S]*?\/\/end-fuwafuwa-end/g, "")
        content = content.replace(/\s*$/, "\n")

        fs.writeFileSync(this.scriptFile, content, Modifier.encode)

        content = fs.readFileSync(this.cssFile, Modifier.encode)
        content = content.replace(/\/\*start-fuwafuwa-start\*\/[\s\S]*?\/\*end-fuwafuwa-end\*\//g, "")
        content = content.replace(/\s*$/, "")
        fs.writeFileSync(this.cssFile, content, Modifier.encode)
    }

    public static insertCSS() {
        //location
        const location = this.cssFile

        //query style configuration
        const config = vscode.workspace.getConfiguration('fuwafuwa')
        const style = config.style

        //add start & remove background
        const content = fs.readFileSync(location, Modifier.encode) + `
/*start-fuwafuwa-start*/

.lines-content.monaco-editor-background {
    background: none
}

[id="workbench.parts.editor"] .split-view-view .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element::before {
    content: ""; pointer-events: none; position: ${style.position};
    top: ${style.top}; right: ${style.right}; bottom: ${style.bottom}; left: ${style.left};
    width: ${style.width}; height: ${style.height}; opacity: ${style.opacity};
    background-size: contain;
    background-repeat: no-repeat;
    background-image: var(--update-image, url("fuwafuwa.png?fuwafuwa=-1"));
    ${style.custom}
}

/*end-fuwafuwa-end*/
`
        fs.writeFileSync(this.cssFile, content, Modifier.encode)
    }

    public static insertJavaScript() {
        //location
        const location = this.scriptFile

        //query style configuration
        const config = vscode.workspace.getConfiguration('fuwafuwa')
        const interval = config.interval * 1000

        //add start & remove update function
        let content = fs.readFileSync(location, Modifier.encode) + `
//start-fuwafuwa-start

var fuwafuwa = { count: 0, update: null, interval: null}
fuwafuwa.update = () => {
    //update count
    fuwafuwa.count = fuwafuwa.count + 1
    //update image
    document.querySelectorAll(\`[id="workbench.parts.editor"] .split-view-view .editor-container .editor-instance\`).forEach((element, idx) => {
        element.style.setProperty('--update-image', \`url("fuwafuwa.png?fuwafuwa=\${fuwafuwa.count-idx}")\`)
    })
}
fuwafuwa.interval = setInterval(fuwafuwa.update, ${interval})

//end-fuwafuwa-end
`
        fs.writeFileSync(location, content, Modifier.encode)
    }

    public static checksum() {
        let product = require(this.productFile)
        let need_update = false
        const checksums = product.checksums
        for (const key in checksums) {
            const content = fs.readFileSync(path.join(this.root, ...key.split("/")))
            const checksum = checksums[key];
            const calculate = crypto.createHash('md5').update(content).digest("base64").replace(/=+$/, "")
            if (checksum === calculate) {
                continue
            }
            product["checksums"][key] = calculate
            need_update = true
        }
        if (!need_update) {
            return
        }
        const json = JSON.stringify(product, null, "\t")
        fs.writeFileSync(this.productFile, json, { encoding: Modifier.encode })
    }

    public static authorized(): boolean {
        const temp = path.join(this.root, "fuwafuwa.txt")
        let written = true
        try {
            fs.writeFileSync(temp, "authorize check", { encoding: Modifier.encode })
        } catch (error) {
            vscode.window.showErrorMessage("ふわふわ需要管理员权限(sudo) Fuwafuwa need install as administrator(sudo)")
            written = false
        }
        if (written) {
            fs.unlinkSync(temp)
        }
        return written
    }

    public static modified(): boolean {
        const css_content = fs.readFileSync(this.cssFile, Modifier.encode)
        const css_match = css_content.match(/\/\*start-fuwafuwa-start\*\/[\s\S]*?\/\*end-fuwafuwa-end\*\//g)
        const js_content = fs.readFileSync(this.scriptFile, Modifier.encode)
        const js_match = js_content.match(/\/\/start-fuwafuwa-start[\s\S]*?\/\/end-fuwafuwa-end/g)
        return css_match != null || js_match != null
    }

    public static openDevTools() {
        //location
        const location = this.scriptFile
        const content = fs.readFileSync(location, Modifier.encode) + `
//start-fuwafuwa-start
var btn = document.createElement("BUTTON");
btn.innerHTML = "CLICK ME";
btn.onclick = () => {
    throw "openDevTools" 
}
document.body.appendChild(btn);
//end-fuwafuwa-end
`
        fs.writeFileSync(location, content, Modifier.encode)
    }
}