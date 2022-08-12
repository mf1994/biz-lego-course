const Koa = require('koa')
const app = new Koa()
const jwt = require('./middlewares/jwt')
const bodyparser = require('koa-bodyparser')
const cors = require('koa2-cors')

const index = require('./routes/index')
const users = require('./routes/users')
const works = require('./routes/works')
const templates = require('./routes/templates')
const utils = require("./routes/utils")

app.use(jwt)
app.use(cors)

app.use(
    bodyparser({
        enableTypes: ['json', 'form', 'text'],
    })
)

app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(works.routes(), works.allowedMethods())
app.use(templates.routes(), templates.allowedMethods())
app.use(utils.routes(), utils.allowedMethods())

console.log("i am running!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

module.exports = app