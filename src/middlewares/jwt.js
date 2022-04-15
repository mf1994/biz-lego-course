/**
 * @description 封装 jwt 插件
 */

const jwtKoa = require('koa-jwt')
const {JWT_SECRET, JWT_IGNORE_PATH} = require("../config/envs/constant")

module.exports = jwtKoa({
    secret: JWT_SECRET,
    cookie: 'jwt_token'
}).unless({
    // 定义哪些路由忽略jwt验证
    path: JWT_IGNORE_PATH
})