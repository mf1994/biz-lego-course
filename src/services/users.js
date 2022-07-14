/**
 * @description 数据操作
 */

const _ = require('lodash')
const UserModel = require("../models/UserModel")

/**
 * @description 查找用户信息
 * @param {object}
 */
async function findOneUserService({username, password, phoneNumber}) {
    // 拼接查询条件
    const whereOpt = {}
    if (username) {
        Object.assign(whereOpt, {username})
    }
    if (password) {
        Object.assign(whereOpt, {username, password})
    }
    if (phoneNumber) {
        Object.assign(whereOpt, {phoneNumber})
    }
    // 无查询条件，则返回空
    if (_.isEmpty(whereOpt)) return null
    // 查询
    const result = await UserModel.findOne({
        where: whereOpt
    })
    if (result == null) {
        // 未查询到用户
        return result
    }
    return result.dataValues
}

/**
 * @description 创建用户
 * @param {object} data
 */
async function createUserService(data = {}) {
    const result = await UserModel.create(data)
    return result.dataValues
}

/**
 * @description 修改用户
 * @param {string} username
 * @param {object} data
 */
async function updateUserInfoService(username, data = {}) {
    if (!username) return false
    if (_.isEmpty(data)) return false
    const result = await UserModel.update(data, {
        where: {
            username
        }
    })
    return result[0] !== 0
}

module.exports = {
    findOneUserService,
    createUserService,
    updateUserInfoService
}