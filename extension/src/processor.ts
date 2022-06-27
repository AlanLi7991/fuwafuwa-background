import * as vscode from "vscode"
import * as fs from "fs"
import * as path from "path"


export default class Processor {

    private native: any = undefined

    constructor(addon: string) {
        if (fs.existsSync(addon)) {
            try {
                this.native = require(addon)
            } catch (error) {
                if (error instanceof Error) {
                    vscode.window.showWarningMessage(`${error.message}`)
                }
            }
        }
    }

    public async generateCache(image: string): Promise<string> {

        const executor = (resolve: any) => {

            if (this.native == undefined || !fs.existsSync(image)) {
                resolve(image)
            }

            const parsed = path.parse(image)
            const dest = path.join(parsed.dir, `fuwafuwa_${parsed.name}.png`)

            if (fs.existsSync(dest)) {
                resolve(dest)
                return
            }
            const ret = this.native?.fuwafuwaImage(image, dest)
            if (ret == 0) {
                resolve(dest)
            } else {
                resolve(image)
                console.log(image + " not white image")
            }
        }
        return new Promise<string>(executor)
    }

}