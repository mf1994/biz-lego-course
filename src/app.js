const Koa = require('koa')
const app = new Koa()
const jwt = require('./middlewares/jwt')

const index = require('./routes/index')

app.use(jwt)

app.use(index.routes(), index.allowedMethods())

module.exports = app