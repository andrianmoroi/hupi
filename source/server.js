import express from "express"
import { join } from "path";
import { getNextPort } from "./ports.js"
import { readFileSync, existsSync, lstatSync } from "fs";
import { listFilesHtmlPage, websocketRefreshScript } from "./htmlScripts.js";
import { startWebSocketServer } from "./webSocketServet.js";

export async function startServer(port, wsPort, path) {
    const app = express()

    app.use(
        (req, res, next) => interceptHtmlFiles(
            req, res, next, wsPort, path
        )
    )
    app.use(express.static(path))

    wsPort = await getNextPort(wsPort)
    startWebSocketServer(wsPort, path)

    port = await getNextPort(port)
    app.listen(port, function () {
        console.log(`Watching path ${path}`)
        console.log(`Server is listening on http://localhost:${port}.`)
    })

    return [port, wsPort, path]
}

function interceptHtmlFiles(req, res, next, wsPort, path) {
    const url = req.url
    const fullPath = join(path, url)
    const rootPath = path

    if (existsSync(fullPath)) {
        const lstat = lstatSync(fullPath)
        const isDirectory = lstat.isDirectory()
        const isFile = lstat.isFile()

        if (isDirectory) {
            const page = listFilesHtmlPage(fullPath, rootPath)

            res.send(page)
        } else if (isFile && fullPath.endsWith(".html")) {
            const file = readFileSync(fullPath)
            const text = file.toString()

            const index = text.lastIndexOf("</body>")

            const result = `
            ${text.slice(0, index)}
            ${websocketRefreshScript(wsPort)}
            ${text.slice(index)}`

            res.send(result)
        } else {
            next()
        }
    } else {
        next()
    }
}

function getFileNameFromUrl(path) {
    const lastSlash = path.lastIndexOf("/")

    let questionMark = path.indexOf("?")
    if (questionMark == -1) {
        questionMark = path.length
    }

    return path.slice(lastSlash + 1, questionMark) || ""
}