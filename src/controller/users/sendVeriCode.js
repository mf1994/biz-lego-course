/**
 * @description 发送短信验证码
 */

const {getVeriCodeFromCache, setVeriCodeToCache} = require("../../cache/users/veriCode")
const {sendVeriCodeFrequentlyFailInfo, sendVeriCodeErrorFailInfo} = require("../../res-model/failInfo/index")
const {ErrorRes, SuccessRes} = require("../../res-model/index")
const {isPrd, isTest} = require("../../utils/env")
const {msgVeriCodeTimeout} = require('../../config/index')


/**
 * @description 发送短信验证码
 * @param {string} phoneNumber
 * @param {boolean} isRemoteTest
 */
async function sendVeriCode(phoneNumber, isRemoteTest = false) {
    // 从缓存获取验证码，看是否有效
    const codeFromCache = await getVeriCodeFromCache(phoneNumber)
    if (codeFromCache) {
        if(!isPrd) {
            // 非线上环境直接返回
            return new SuccessRes({code: codeFromCache})
        }
        // 不再重复发送
        return new ErrorRes(sendVeriCodeFrequentlyFailInfo)
    }
    // 缓存中没有则重新发送
    const veriCode = Math.random().toString().slice(-4) // 生成随机数
    let sendSuccess = false
    if (isTest) {
        // 本地接口测试，不发送短信
        sendSuccess = true
    } else if (isRemoteTest) {
        // 远程接口测试，也不发送短信
        sendSuccess = true
    } else {
        // 真实场景，发送短信
        try {
            // 短信提示的过期时间(分钟)
            // const msgTimeoutMin = (msgVeriCodeTimeout / 60).toString()
            // 发送短信 TODO

        } catch (ex) {
            sendSuccess = false
            console.error('发送短信验证码失败', ex)
            // TODO 报警，解决问题
        }
    }
    if (!sendSuccess) {
        return new ErrorRes(sendVeriCodeErrorFailInfo)
    }
    // 发送成功，设置缓存
    setVeriCodeToCache(phoneNumber, veriCode, msgVeriCodeTimeout)
    // 返回成功信息
    const resData = isPrd ? {} : {code: veriCode} // 测试环境直接反馈验证码
    return new SuccessRes(resData)
}

module.exports = sendVeriCode