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

app.use(cors({
  origin:"*", // 允许来自指定域名请求
  maxAge: 5, // 本次预检请求的有效期，单位为秒。
  methods:['GET','POST', 'PATCH', 'DELETE',],  // 所允许的HTTP请求方法
  alloweHeaders:['Conten-Type'], // 服务器支持的所有头信息字段
  credentials: true // 是否允许发送Cookie
}))


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