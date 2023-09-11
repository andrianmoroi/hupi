import express from "express"
import { join } from "path";
import { getNextPort } from "./ports.js"
import { readFileSync, existsSync } from "fs";
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
    const fileName = getFileNameFromUrl(url)

    if (fileName.endsWith(".html")) {
        const filePath = join(path, url, fileName)

        if (existsSync(filePath)) {
            const file = readFileSync(filePath)
            const text = file.toString()

            const index = text.lastIndexOf("</body>")

            const result = `
            ${text.slice(0, index)}
            ${websocketRefreshScript(wsPort)}
            ${text.slice(index)}`

            res.send(result)
        } else {
            res.send(listFilesHtmlPage(join(path, url)))
        }
    } else {
        next()
    }
}

function getFileNameFromUrl(url) {
    const lastSlash = url.lastIndexOf("/")

    let questionMark = url.indexOf("?")
    if (questionMark == -1) {
        questionMark = url.length
    }

    return url.slice(lastSlash + 1, questionMark) || "index.html"
}