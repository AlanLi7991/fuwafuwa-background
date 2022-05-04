import * as fs from "fs"
import * as path from "path"
import Finding from "./finding";
import Manager from "./manager";
import Image from "./image";

export class InnerRandom extends Manager {

    private names: string[] = []

    public load(): void {
        //query
        let files = fs.readdirSync(Finding.defaultRandom).filter((s) => {
            return Image.validExtension(s)
        })
        for (let i = files.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            files[i], files[j] = files[j], files[i]
        }
        this.names = files
    }

    public shift(): void {
        const directory = Finding.defaultRandom
        //pop first and append
        let first = this.names.shift()
        if (!first) {
            return
        }
        const file = path.join(directory, first)
        if (fs.existsSync(file)) {
            fs.copyFileSync(file, Finding.runtimeImage)
        }
        this.names.push(first)
    }
}

export class InnerStable extends Manager {

    public load(): void {
        const pool = Finding.defaultStable
        const results = fs.readdirSync(pool).filter((s) => {
            return Image.validExtension(s)
        })
        fs.copyFileSync(path.join(pool, results[0]), Finding.runtimeImage)
    }

}