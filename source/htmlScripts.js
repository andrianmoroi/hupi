import { getFiles } from "./filesHelper.js";

export function listFilesHtmlPage(path, rootPath) {
    const relativePath = path.replace(rootPath, '')
    const files = getFiles(path, relativePath)

    const elements = files.map(
        ({ name, path }) => `<div><a href="${path}">${name}</a></div>`
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
            const {hostname, pathname} = window.location
            const url = "ws://" + hostname + ":" + ${wsPort} + pathname
            console.log("Live reloading is enabled.")

            try {
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
            } catch(error) {
                console.warn(\`Cannot connect to \${url} for auto-reloading the page.\`)
            }
        }

        addEventListener("DOMContentLoaded", async (event) => { 
            connect()
        })
    </script> `
}