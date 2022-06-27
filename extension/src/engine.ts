import * as vscode from "vscode"
import Manager from "./manager"
import Modifier from "./modifier"

export default class Engine {

    private manager?: Manager.Image
    private interval?: NodeJS.Timeout

    constructor(public context: vscode.ExtensionContext) { }

    public update(event: vscode.ConfigurationChangeEvent) {
        // stop first
        this.stop()

        // if change style/interval/opacity show information
        const style = event.affectsConfiguration("fuwafuwa.style")
        const interval = event.affectsConfiguration("fuwafuwa.interval")
        if (interval || style) {
            vscode.window.showInformationMessage("ふわふわ需重新启用 Fuwafuwa need toggle again")
            return
        }
        
        this.start()
    }

    public async start() {

        this.manager = Manager.instance(this.context)

        //load data
        try {
            await this.manager?.load()
            await this.manager?.shift()
        } catch (error) {
            if (error instanceof Error) {
                vscode.window.showWarningMessage(`${error.message}`)
            }
        }

        //init interval
        this.interval = setInterval(async () => {
            try {
                await this.manager?.shift()
            } catch (error) {
                if (error instanceof Error) {
                    vscode.window.showWarningMessage(`${error.message}`)
                }
            }
        }, (vscode.workspace.getConfiguration('fuwafuwa').interval ?? 10) * 900)
    }

    public stop() {
        //invalid first
        clearInterval(this.interval!)
        this.manager = undefined
        this.interval = undefined
        //clean
        Modifier.clean()
    }

}