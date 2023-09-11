#!/usr/bin/env node

import { DEFAULT_PORT, WS_DEFAULT_PORT } from "./source/constants.js"
import { startServer } from "./source/server.js"

console.log("HUPI is running.")

startServer(DEFAULT_PORT, WS_DEFAULT_PORT, process.cwd())
    .catch(console.error)