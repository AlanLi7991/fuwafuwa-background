
export default class Access {

    private static raw = ""

    public static Unsplash: string = (() => {
        let i = 0
        let result = ""
        for (const c of Access.raw) {
            if (i % 2 == 0) {
                if (c == "#") {
                    return result
                }
                result += c
            }
            i += 1
        }
        return result
    })()

    public static MovieDB: string = (() => {
        let i = 0
        let result = ""
        for (const c of Access.raw) {
            if (i % 2 == 1) {
                if (c == "#") {
                    return result
                }
                result += c
            }
            i += 1
        }
        return result
    })()

}