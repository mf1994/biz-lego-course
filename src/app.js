const Koa = require('koa')
const app = new Koa()
const jwt = require('./middlewares/jwt')
const bodyparser = require('koa-bodyparser')

const index = require('./routes/index')
const users = require('./routes/users')
const works = require('./routes/works')
const templates = require('./routes/templates')

app.use(jwt)

app.use(
    bodyparser({
        enableTypes: ['json', 'form', 'text'],
    })
)

app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(works.routes(), users.allowedMethods())
app.use(works.routes(), templates.allowedMethods())

console.log("i am running!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

module.exports = app