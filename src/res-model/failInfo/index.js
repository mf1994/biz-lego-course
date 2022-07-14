/**
 * @description 错误信息配置
 */

const usersInfos = require('./user')
const worksInfos = require('./works')

module.exports = {
    ...usersInfos,
    ...worksInfos
}