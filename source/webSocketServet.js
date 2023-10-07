import { WebSocketServer } from "ws";
import gaze from "gaze";

export function startWebSocketServer(wsPort, path, patterns) {
    const wss = new WebSocketServer({
        port: wsPort
    })

    gaze(patterns, { cwd: path }, function () {
        this.on('all', function () {
            wss.clients.forEach(ws => ws.send("refresh"))
        })
    })

    process.on('SIGINT', function () {
        console.log("Caught interrupt signal")

        wss.clients.forEach(s => s.close())

        process.exit();
    })
}