const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')
const compression = require('compression')

const staticFileMiddleware = express.static(path.join(__dirname + "/dist"), {
  maxAge: 604800000,
  setHeaders: function (res, path) {
    res.setHeader('X-FRAME-OPTIONS', 'DENY')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Cache-Control', 'max-age=604800000')
    res.setHeader('Expires', new Date(Date.now() + 2592000000 * 30).toUTCString())
  }
})

app = express()
app.use(compression())
app.use(staticFileMiddleware)
app.use(serveStatic(__dirname + "/dist"))


const port = process.env.PORT || 5000

app.listen(port)