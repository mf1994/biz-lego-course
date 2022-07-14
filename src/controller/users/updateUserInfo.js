/**
 * @decription 修改用户信息
 */

const {updateUserInfoService} = require('../../services/users')
const {ErrorRes, SuccessRes} = require('../../res-model/index')
const {updateUserInfoDbErrorFailInfo} = require('../../res-model/failInfo')
const {jwtSign} = require('../../utils/jwt')

/**
 * @description 修改用户信息
 * @param {object} curUserInfo 
 * @param {object} data 
 */
async function updateUserInfo(curUserInfo, data = {}) {
    const {username} = curUserInfo
    let res 
    try {
        res = await updateUserInfoService(username, data)
    } catch (ex) {
        console.error('修改用户信息失败', ex)
        return new ErrorRes(updateUserInfoDbErrorFailInfo)
    }
    if (res) {
        const newUserInfo = {
            ...curUserInfo,
            ...data
        }
        delete newUserInfo.iat
        delete newUserInfo.exp
        return new SuccessRes({
            token: jwtSign(newUserInfo)
        })
    }

    // 修改失败
    return new ErrorRes(updateUserInfoFailInfo) // 失败，但数据库操作正确
}

module.exports = updateUserInfo