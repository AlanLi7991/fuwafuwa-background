import * as vscode from "vscode"
import fetch from "node-fetch"
import { URL, URLSearchParams } from "url"
import Access from "./access"

namespace Source {

    const Host = {
        unsplash: {
            access: "https://api.unsplash.com/photos/random",
        },
        movieDB: {
            domain: "https://api.themoviedb.org/3",
            gallery: "https://www.themoviedb.org/t/p/original",
            search: "/search/movie",
            images: "/movie/{movie_id}/images"
        },
        likepoems: {
            mc: "https://api.likepoems.com/img/mc",
            bing: "https://api.likepoems.com/img/bing",
            pixiv: "https://api.likepoems.com/img/pixiv?type=json"
        }
    }

    export function instance(): Handler {
        // check use random or stable
        const mode = vscode.workspace.getConfiguration('fuwafuwa').source ?? "Pixiv"
        if (mode === "Bing") {
            return new Bing()
        }
        if (mode === "MovieDB") {
            return new MovieDB()
        }
        if (mode === "Unsplash") {
            return new Unsplash()
        }
        return new Pixiv()
    }

    export class Entry {
        public folder: string = ""
        constructor(readonly url: URL, readonly name: string) {}
    }
    
    export class Handler {

        constructor(readonly host: string, readonly name: string) {}

        request(): Promise<Entry[]> {
            return new Promise(this.random)
        }

        protected random = async (resolve:any, reject: any) => {
            const url = new URL(this.host)
            var timestamp = Math.round((new Date()).getTime() / 1000)
            const name = `${this.name}_${timestamp}.png`
            resolve([new Entry(url, name)])           
        }

    }

    class Pixiv extends Handler {
        constructor() {
            super(Host.likepoems.pixiv, "Pixiv")
        }   

        private location = async (resolve: any, reject: any) => {
            const url = new URL(this.host)
            try {
                const response = await fetch(url)
                const data = await response.json()
                const location = data["url"]
                const name = location.substring(location.lastIndexOf('/')+1);
                const result = new Entry(new URL(location), name)
                resolve([result])
            } catch (error) {
                reject(error)
            }            
        }

        request(): Promise<Entry[]> {
            return new Promise(this.location)
        }
    }

    class Bing extends Handler {
        constructor() {
            super(Host.likepoems.bing, "Bing")
        }  
    }

    class MovieDB extends Handler {
        private page = 0
        private ids: string[] = []
        private names: string[] = []
        constructor() {
            super(Host.movieDB.domain, vscode.workspace.getConfiguration('fuwafuwa').query as string)
        }

        private search = async (resolve: any, reject: any) => {
            
            const index = this.page + 1
            const search = new URL(`${this.host}${Host.movieDB.search}`)
            try {
                search.search = new URLSearchParams({
                    "api_key": Access.MovieDB,
                    "page": index.toString(),
                    "query": this.name.length != 0 ? this.name : "Casablanca"
                }).toString()
                const response = await fetch(search)
                const data = await response.json()
                if (Array.isArray(data["results"]) == false) {
                    reject(new Error("MovieDB response error"))
                    return
                }

                const word = this.name.replace(/\s/g, "").toLowerCase()
                for (const movie of data["results"]) {
                    const title = movie["title"] as string
                    const id = movie["id"] as string
                    const content = title.replace(/\s/g, "").toLowerCase()
                    if (content.includes(word)) {
                        this.names.push(title)
                        this.ids.push(id)
                    }
                }

                await this.backdrops(resolve, reject)
                this.page += 1

            } catch (error) {
                reject(new Error(`HTTP Error ${search.host}${search.pathname}`))
            } 
        }

        private backdrops = async (resolve: any, reject: any) => {
            if (this.ids.length == 0 || this.names.length == 0) {
                reject(new Error("MovieDB response error"))
                return
            }

            const name = this.names.shift()!
            const path = Host.movieDB.images.replace("{movie_id}", this.ids.shift()!)
            const images = new URL(`${this.host}${path}`)
            try {
                images.search = new URLSearchParams({
                    "api_key": Access.MovieDB
                }).toString()
                const response = await fetch(images)
                const data = await response.json()
                if (Array.isArray(data["backdrops"]) == false || Array.isArray(data["posters"]) == false) {
                    reject(new Error("MovieDB response error"))
                    return
                }
                let results = new Array<Entry>()
                for (const key of ["backdrops", "posters"]) {
                    for (const movie of data[key]) {
                        const path = movie["file_path"] as string
                        const filename = path.replace("/", `${name}_${key}_`)
                        const entry = new Entry(new URL(`${Host.movieDB.gallery}${path}`), filename)
                        entry.folder = name
                        results.push(entry)
                    }
                }
                results.sort(() => Math.random() - 0.5)
                resolve(results)
            } catch (error) {
                reject(new Error(`HTTP Error ${images.host}${images.pathname}`))
            } 
        }

        request(): Promise<Entry[]> {
            if (this.ids.length > 0 && this.names.length > 0) {
                return new Promise(this.backdrops)
            } else {
                return new Promise(this.search)
            }
        }

    }

    class Unsplash extends Handler {

        constructor() {
            super(Host.unsplash.access, vscode.workspace.getConfiguration('fuwafuwa').query as string)
        }  
        
        private requestAccess = async (resolve: any, reject: any) => {

            try {
                const url = new URL(this.host)
                url.search = new URLSearchParams({
                    "client_id": Access.Unsplash,
                    "count": "30",
                    "query": this.name
                }).toString()
                const response = await fetch(url)
                const data = await response.json()
                if (response.ok == false) {
                    reject(new Error("Unsplash error: " + JSON.stringify(data)))
                    return
                }
                const result = data.map((obj: any, idx: number)=> {
                    const url = new URL(obj.links.download)
                    const name = `${obj.id}.png`
                    const entry = new Entry(url, name)
                    entry.folder = this.name
                    return entry
                })
                resolve(result)
            } catch (error) {
                reject(new Error(`HTTP Error ${this.host}`))
            }            
        }

        request(): Promise<Entry[]> {
            return new Promise(this.requestAccess)
        }

    }
}

export default Source