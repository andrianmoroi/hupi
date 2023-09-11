import { createServer } from "net"

export async function getNextPort(port) {
    while (!(await isPortOpen(port))) {
        port++
    }

    return port
}

function isPortOpen(port) {
    return new Promise((resolve, reject) => {
        let server = createServer()
        
        server.on('error', function (err) {
            if (err.code === "EADDRINUSE") {
                resolve(false)
            } else {
                reject(err)
            }
        })
        
        server.on('listening', function () {
            server.close()

            resolve(true)
        })

        server.listen(port)
    })
}
