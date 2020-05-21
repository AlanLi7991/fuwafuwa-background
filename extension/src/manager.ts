import * as vscode from "vscode"
import * as fs from "fs"
import * as path from "path"
import Finding from "./finding";

export default class Manager {
    
    public load(): void {

    }

    public static clean(): void {
        const directory = Finding.activeDirectory
        //mkdir
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true })
        }
        fs.readdirSync(directory).forEach((name) => {
            fs.unlinkSync(path.join(directory, name))
        })
    }

    public shift(): void {

    }
    
}