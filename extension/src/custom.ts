import * as vscode from "vscode"
import * as fs from "fs"
import * as path from "path"
import * as crypto from "crypto"
import Image from "./image"
import Finding from "./finding";
import Manager from "./manager";

export class CustomRandom extends Manager {

    private skip_once = false
    private frozen = false
    private hash = "empty"
    private names: string[] = []
    private sequence: Image[] = []

    load(): void {
        this.fillNames()
        this.fillSequence()
    }

    shift(): void {
        if (this.skip_once) {
            vscode.window.showInformationMessage("ふわふわ数据读准备中 Fuwafuwa data preparing")
            this.skip_once = false
            return
        }
        const directory = Finding.activeDirectory
        //query
        const activities = fs.readdirSync(directory).sort()
        const temp = Finding.activeImage(activities.length)
        //delete
        const first = activities.shift()
        //has image 
        if (first) {
            //loop / remove activities
            if (this.sequence.length == 0) {
                fs.renameSync(path.join(directory, first), temp)
                activities.push(path.basename(temp))
            } else {
                fs.unlinkSync(path.join(directory, first))
            }
        }
        //rename active images
        for (let i = 0; i < activities.length; i++) {
            const element = activities[i]
            fs.renameSync(path.join(directory, element), Finding.activeImage(i))
        }
        //slice sequence
        const append = Math.min(Finding.capacity - activities.length, this.sequence.length)
        const candidates = this.sequence.splice(0, append)
        //push sequence to active
        for (let i = 0; i < candidates.length; i++) {
            const element = candidates[i]
            fs.copyFileSync(element.cacheImage, Finding.activeImage(activities.length + i))
        }
        //check enough name
        const empty = this.names.length == 0
        const lack = (activities.length + candidates.length) < Finding.capacity
        if (empty) {
            //if not frozen, frozen it
            if (lack && !this.frozen) {
                this.frozen = true
                vscode.window.showWarningMessage(`随机图片有效数不足，请添加更多图片或关闭切图 Random images aren't enough, need prepare more or disable segment`)
            }
            //fill names again, query if images changed
            this.fillNames()
        }
        //fill sequence for next loop
        this.fillSequence()
    }


    private fillSequence() {
        // recursive stop condition
        const full = this.sequence.length >= Finding.capacity
        if (full) {
            return
        }
        const empty = this.names.length == 0
        if (empty) {
            return
        }
        //take next one
        const random = this.names.shift()!;
        const image = new Image(random)
        image.generateCache().then((success) => {
            if (success) {
                this.sequence.push(image)
            }
            //recursive
            this.fillSequence()
        })
    }

    private fillNames() {
        //lock first for shift
        this.skip_once = true
        //read 
        const folder = vscode.workspace.getConfiguration('fuwafuwa').folder
        const results = fs.readdirSync(folder).filter((s) => {
            return Image.validExtension(s)
        })
        //not empty
        if (results.length != 0) {
            //hash for finding image changed
            const content = results.reduce((prev, cur) => prev + cur)
            const md5 = crypto.createHash('md5').update(content).digest("base64").replace(/=+$/, "")
            //files change
            if (this.hash !== md5) {
                this.hash = md5
                this.frozen = false
            }
            //for 2 situation
            //  1. not frozen, fill up names again for random
            //  2. frozen, activities plus sequence not enough for capacity, stop random, begin loop exist
            //  3. 
            if (!this.frozen) {
                this.names = results.sort(() => Math.random() - 0.5)
            }
        }
        this.skip_once = false
    }

}

export class CustomStable extends Manager {

    load(): void {
        const background = vscode.workspace.getConfiguration('fuwafuwa').image
        for (let i = 0; i < Finding.capacity; i++) {
            fs.copyFileSync(background, Finding.activeImage(i))
        }
    }

}
