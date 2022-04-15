/**
 * @description 登录校验中间件
 */
const {jwtVerify} = require('../utils/jwt')
const {ErrorRes} = require("../res-model/index")
const {loginCheckFailInfo} = require("../res-model/failInfo/index")

/**
 * @description 登录校验
 * @param {object} ctx ctx
 * @param {function} next next
 */
module.exports = async function loginCheck(ctx, next) {
    // 错误标准信息
    const errRes = new ErrorRes(loginCheckFailInfo)
    // 获取token
    const token = ctx.header.authorization
    if (!token) {
        ctx.body = errRes
        return
    }
    let flag = true
    try {
        const userInfo = await jwtVerify(token)
        delete userInfo.password // 屏蔽密码
        // 验证成功，获取userInfo
        ctx.body = userInfo
    } catch (ex) {
        flag = false
        ctx.body = errRes
    }
    if (flag) {
        await next()
    }
}