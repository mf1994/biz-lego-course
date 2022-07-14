/**
 * @description 短信验证码 缓存
 */

const {cacheGet, cacheSet} = require('../index')

// cache key 前缀，重要！！否则数据容易混乱
const prefix = 'phoneVeriCode-'

/**
 * @description 从缓存获取验证码
 * @param {string} phoneNumber
 */
async function getVeriCodeFromCache(phoneNumber) {
    const key = `${prefix}${phoneNumber}`
    const code = await cacheGet(key)
    if (code == null) return code
    return code.toString()
}

/**
 * @description 缓存验证码
 * @param {string} phoneNumber
 * @param {string} veriCode
 * @param {number} timeout s
 */
async function setVeriCodeToCache(phoneNumber, veriCode, timeout) {
    const key = `${prefix}${phoneNumber}`
    cacheSet(key, veriCode, timeout)
}

module.exports = {
    getVeriCodeFromCache,
    setVeriCodeToCache
}