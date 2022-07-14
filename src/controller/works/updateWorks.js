/**
 * @description 修改作品
 */

const {ErrorRes, SuccessRes} = require("../../res-model/index")
const {updateWorkFailInfo, updateWorkDbErrorFailInfo, transferWorkFailInfo} = require("../../res-model/failInfo")
const _ = require("lodash")
const {updateWorkService} = require('../../services/works')
const {findOneUserService} = require("../../services/users")

/**
 * @description 修改作品
 * @param {string} id
 * @param {string} author
 * @param {object} data
 */
async function updateWorks(id, author, data = {}) {
    if (!id || !author) return new ErrorRes(updateWorkFailInfo, 'id 或 author 不能为空')
    if (_.isEmpty(data)) return new ErrorRes(updateWorkFailInfo, '修改内容不能为空')
    let res
    try {
        res = await updateWorkService(data, {id, author})
    } catch (ex) {
        console.error('更新作品数据失败', ex)
        return new ErrorRes(updateWorkDbErrorFailInfo)
    }

    // 成功
    if (res) return new SuccessRes
    // 失败
    return new ErrorRes(updateWorkFailInfo, 'id 或 author 不匹配')
}

/**
 * @description 转赠作品
 * @param {string} id
 * @param {string} author
 * @param {string} receiverUsername
 */
async function transferWorks(id, author, receiverUsername) {
    if (author === receiverUsername) return new ErrorRes(transferWorkFailInfo, '作者和接受人相同')
    const receiver = await findOneUserService({username: receiverUsername})
    if (!receiver) return new ErrorRes(transferWorkFailInfo, '接受人未找到')
    const res = await updateWorks(id, author, {
        author: receiverUsername
    })
    return res
}

module.exports = {
    updateWorks,
    transferWorks
}