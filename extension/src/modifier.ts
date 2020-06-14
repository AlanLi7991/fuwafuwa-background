import * as fs from "fs"
import * as path from "path"
import * as vscode from "vscode"
import * as crypto from "crypto"
import * as URL from "url"
import Finding from "./finding"


export default class Modifier {

    public static backup() {
        //mkdir
        if (!fs.existsSync(Finding.backupDirectory)) {
            fs.mkdirSync(Finding.backupDirectory, { recursive: true })
        }
        
        //paths
        const css = Finding.cssFile
        const script = Finding.scriptFile
        const product = Finding.productFile

        const back_css = path.join(Finding.backupDirectory, path.basename(css))
        const back_script = path.join(Finding.backupDirectory, path.basename(script))
        const back_product = path.join(Finding.backupDirectory, path.basename(product))

        //backup
        const backups = [back_css, back_script, back_product]
        const locations = [css, script, product]

        for (let i = 0; i < backups.length; i++) {
            const backup = backups[i];
            const location = locations[i]
            if (fs.existsSync(backup)) {
                fs.unlinkSync(backup)
            }
            fs.copyFileSync(location, backup)
        }
    }

    public static restore(): boolean {
        //paths
        const css = Finding.cssFile
        const script = Finding.scriptFile
        const product = Finding.productFile

        const back_css = path.join(Finding.backupDirectory, path.basename(css))
        const back_script = path.join(Finding.backupDirectory, path.basename(script))
        const back_product = path.join(Finding.backupDirectory, path.basename(product))

        const backupValid = fs.existsSync(back_css) && fs.existsSync(back_script) && fs.existsSync(back_product)

        if (!backupValid) {
            return false
        }

        const backups = [back_css, back_script, back_product]
        const locations = [css, script, product]

        for (let i = 0; i < backups.length; i++) {
            const backup = backups[i];
            const location = locations[i]
            fs.unlinkSync(location)
            fs.renameSync(backup, location)
        }

        return true
    }

    public static repair() {
        let content = fs.readFileSync(Finding.scriptFile, Finding.encode)
        content = content.replace(/\/\/start-fuwafuwa-start[\s\S]*?\/\/end-fuwafuwa-end/g, "")
        content = content.replace(/\s*$/, "\n")

        fs.writeFileSync(Finding.scriptFile, content, Finding.encode)

        content = fs.readFileSync(Finding.cssFile, Finding.encode)
        content = content.replace(/\/\*start-fuwafuwa-start\*\/[\s\S]*?\/\*end-fuwafuwa-end\*\//g, "")
        content = content.replace(/\s*$/, "")
        fs.writeFileSync(Finding.cssFile, content, Finding.encode)
    }

    public static insertCSS() {
        //location
        const location = Finding.cssFile

        //query style configuration
        const config = vscode.workspace.getConfiguration('fuwafuwa')
        const opacity = config.opacity
        const style = config.style

        //add start & remove background
        const content = fs.readFileSync(location, Finding.encode) + `
/*start-fuwafuwa-start*/

.lines-content.monaco-editor-background {
    background: none
}

[id="workbench.parts.editor"] .split-view-view .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element::before {
    content: ""; pointer-events: none; position: ${style.position};
    top: ${style.top}; right: ${style.right}; bottom: ${style.bottom}; left: ${style.left};
    width: ${style.width}; height: ${style.height}; opacity: ${opacity};
    background-size: contain;
    background-repeat: no-repeat;
    background-image: var(--update-image, url("${URL.pathToFileURL(Finding.activeImage(0))}?fuwafuwa=\${fuwafuwa.count}"));
    ${style.custom}
}

/*end-fuwafuwa-end*/
`
        fs.writeFileSync(Finding.cssFile, content, Finding.encode)
    }

    public static insertJavaScript() {
        //location
        const location = Finding.scriptFile

        //query style configuration
        const config = vscode.workspace.getConfiguration('fuwafuwa')
        const interval = config.interval * 1000

        //add start & remove update function
        let content = fs.readFileSync(location, Finding.encode) + `
//start-fuwafuwa-start

var fuwafuwa = { count: 0, update: null, interval: null}
fuwafuwa.update = () => {
    //update count
    fuwafuwa.count = fuwafuwa.count + 1
    //update image
    document.querySelectorAll(\`[id="workbench.parts.editor"] .split-view-view .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element\`).forEach((element, idx) => {
        element.style.setProperty('--update-image', \`url("${URL.pathToFileURL(Finding.activeDirectory)}/\${idx}.png?fuwafuwa=\${fuwafuwa.count}")\`);
    })
}
fuwafuwa.interval = setInterval(fuwafuwa.update, ${interval})

//end-fuwafuwa-end
`
        fs.writeFileSync(location, content, Finding.encode)
    }

    public static checksum() {
        let product = require(Finding.productFile)
        let need_update = false
        const checksums = product.checksums
        for (const key in checksums) {
            const content = fs.readFileSync(path.join(Finding.root, ...key.split("/")))
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
        fs.writeFileSync(Finding.productFile, json, { encoding: Finding.encode })
    }

    public static authorized(): boolean {
        const temp = path.join(Finding.root, "fuwafuwa.txt")
        let written = true
        try {
            fs.writeFileSync(temp, "authorize check", { encoding: Finding.encode })
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
        const css_content = fs.readFileSync(Finding.cssFile, Finding.encode)
        const css_match = css_content.match(/\/\*start-fuwafuwa-start\*\/[\s\S]*?\/\*end-fuwafuwa-end\*\//g)
        const js_content = fs.readFileSync(Finding.scriptFile, Finding.encode)
        const js_match = js_content.match(/\/\/start-fuwafuwa-start[\s\S]*?\/\/end-fuwafuwa-end/g)
        return css_match != null || js_match != null
    }

    public static openDevTools() {
        //location
        const location = Finding.scriptFile
        const content = fs.readFileSync(location, Finding.encode) + `
//start-fuwafuwa-start
var btn = document.createElement("BUTTON");
btn.innerHTML = "CLICK ME";
btn.onclick = () => {
    throw "openDevTools" 
}
document.body.appendChild(btn);
//end-fuwafuwa-end
`
        fs.writeFileSync(location, content, Finding.encode)
    }
}