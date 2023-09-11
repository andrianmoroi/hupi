import { readdirSync } from "fs"

export function listFilesHtmlPage(path) {
    const files = readdirSync(path).map(m => ({
        file: m,
        path: `/${m}`
    }))

    const elements = files.map(
        ({ file, path }) => `<div><a href="${path}">${file}</a></div>`
    )

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Live reloader</title>
    </head>
    <body>
        ${elements.join("\n")}
    </body>
    </html>`
}

export function websocketRefreshScript(wsPort) {
    return `
    <script>
        function connect() {
            console.log("Live reloading is enabled.")
            
            const {hostname, pathname} = window.location
            const url = "ws://" + hostname + ":" + ${wsPort} + pathname

            let socket = new WebSocket(url)

            socket.onmessage = function(event) {
                const {data} = event
                console.log(data)
                if(data == "refresh")
                {
                    location.reload()
                }
            }

            socket.onclose = function(e) {
                console.log("close")
                setTimeout(function() {
                    connect()
                }, 3000)
            }
            
            socket.onerror = function(err) {
                console.log("error")
                socket.close()
            }
        }

        addEventListener("DOMContentLoaded", async (event) => { 
            connect()
        })
    </script> `
}