import * as fs from "fs"
import * as path from "path"
import Finding from "./finding";
import Manager from "./manager";
import Image from "./image";

export class InnerRandom extends Manager {

    load(): void {
        const pool = Finding.defaultRandom
        const results = fs.readdirSync(pool).filter((s) => {
            return Image.validExtension(s)
        })
        results.forEach((name, idx) => {
            fs.copyFileSync(path.join(pool, name), Finding.activeImage(idx))
        })
    }

    shift(): void {
        const directory = Finding.activeDirectory
        //query
        const activities = fs.readdirSync(directory).sort()
        const temp = Finding.activeImage(activities.length)
        //rename first and append
        let first = activities.shift()
        if (first) {
            fs.renameSync(path.join(directory, first), temp)
            activities.push(path.basename(temp))
        }
        //rename active images
        for (let i = 0; i < activities.length; i++) {
            const element = activities[i]
            fs.renameSync(path.join(directory, element), Finding.activeImage(i))
        }
    }
}

export class InnerStable extends Manager {

    load(): void {
        const stable = Finding.defaultStable
        for (let i = 0; i < Finding.capacity; i++) {
            fs.copyFileSync(stable, Finding.activeImage(i))   
        }
    }

}