import { WATCH_FILE } from "./constants.js";
import { join } from "path";
import { readFileSync, existsSync } from "fs";
import { EOL } from "os";

export function getConfig(path) {
    const watchPath = join(path, WATCH_FILE)
    let watchPatterns = ["**/*.*"]

    if (existsSync(watchPath)) {
        console.log("Found watch patterns, the page will be refreshed only when those files will be changed.")

        const text = readFileSync(watchPath, { encoding: 'utf-8', flag: 'r' })
        const patterns = text
            ?.split(EOL)
            .filter(m => m)
            .map(m => m.trim())
            .filter(m => !m.startsWith("#"))


        watchPatterns = patterns
    }

    return { watchPatterns }
}