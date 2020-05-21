import * as vscode from "vscode"

export namespace Setting {

    export enum Type { Hidden, Random, Segment, Image, Folder, Cache, Install, Uninstall }

    export class Item implements vscode.QuickPickItem {

        constructor(public label: string, public description: string, public type: Type) { }

        public static list(): Item[] {

            const hidden = new Item("$(color-mode)  隐藏 Hidden", "隐藏ふわふわ (Hide ふわふわ)", Type.Hidden)
            const random = new Item("$(sync)  随机 Random", "显示固定图片 (Use radom image)", Type.Random)
            const segment = new Item("$(symbol-misc)  切图 Segment", "自动切图 (Auto segment)", Type.Segment)
            const image = new Item("$(file-media)  图片 Image", "配置固定背景图 (Configure stable background image)", Type.Image)
            const folder = new Item("$(file-directory)  目录 Folder", "配置随机图片目录 (Configure random image folder)", Type.Folder)
            const cache = new Item("$(database)  缓存 Cache", "配置缓存图片目录 (Configure cache image folder)", Type.Cache)          
            const install = new Item("$(sign-in)  启用 Install", "启用ふわふわ (Install ふわふわ)", Type.Install)
            const uninstall = new Item("$(sign-out)  停用 Uninstall", "停用ふわふわ (Uninstall ふわふわ)", Type.Uninstall)

            return [hidden, random, segment, image, folder, cache, install, uninstall]

        }
    }
}

export default Setting
