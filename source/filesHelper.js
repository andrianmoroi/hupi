import { readdirSync } from "fs"
import { resolve } from "path";

export function getFiles(path, prefix) {
    const files = readdirSync(path)
        .map(m => ({
            name: m,
            path: resolve(prefix, m),
        }))

    const parent = resolve(prefix, "..")
    if (parent !== prefix) {
        files.splice(0, 0, {
            name: "..",
            path: resolve(prefix, "..")
        })
    }

    return files
}