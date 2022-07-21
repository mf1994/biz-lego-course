/**
 * @description 错误信息配置
 */

const usersInfos = require('./user')
const worksInfos = require('./works')
const utilsInfos = require("./utils")

module.exports = {
    ...usersInfos,
    ...worksInfos,
    ...utilsInfos
}