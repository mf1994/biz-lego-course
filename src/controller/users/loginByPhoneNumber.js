/**
 * @description 通过手机号验证码登录
 */
const {getVeriCodeFromCache} = require('../../cache/users/veriCode')
const {ErrorRes, SuccessRes} = require("../../res-model/index")
const {loginVeriCodeIncorrectFailInfo, userFrozenFailInfo, createUserDbErrorFailInfo} = require('../../res-model/failInfo/index')
const {findOneUserService, createUserService, updateUserInfoService} = require('../../services/users')
const {jwtSign} = require("../../utils/jwt")
const genPassword = require('../../utils/genPassword')
const doCrypto = require('../../utils/cryp')

async function loginByPhoneNumber(phoneNumber, veriCode) {
    const veriCodeFromCache = await getVeriCodeFromCache(phoneNumber)
    if (veriCode !== veriCodeFromCache) {
        // 验证码不正确
        return new ErrorRes(loginVeriCodeIncorrectFailInfo)
    }

    // 先查找，找到就返回
    const userInfo = await findOneUserService({
        phoneNumber
    })
    if (userInfo) {
        // 用户是否被冻结
        if (userInfo.isFrozen) return new ErrorRes(userFrozenFailInfo)

        // 更新最后登录时间
        try {
            await updateUserInfoService(userInfo.username, {
                latestLoginAt: new Date()
            })
        } catch (ex) {
            console.error('更新最后登录时间错误', ex)
        }
        // 返回登录成功信息
        return new SuccessRes({
            token: jwtSign(userInfo)
        })
    }

    // 查找不到，再创建
    let password = genPassword()
    password = doCrypto(password)

    try {
        const newUser = await createUserService({
            username: phoneNumber,
            password,
            phoneNumber,
            nickName: `乐高${phoneNumber.slice(-4)}`, // 默认给一个昵称
            latestLoginAt: new Date()
        })
        return new SuccessRes({
            token: jwtSign(newUser)
        })
    } catch (ex) {
        console.error('创建用户失败',ex)
        return new ErrorRes(createUserDbErrorFailInfo)
    }
}

module.exports = loginByPhoneNumber