const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')
const compression = require('compression')

app = express()
app.use(serveStatic(__dirname + "/dist"))
app.use(compression())

const port = process.env.PORT || 5000

app.listen(port)