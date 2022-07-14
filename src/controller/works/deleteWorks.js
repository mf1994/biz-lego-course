/**
 * @description 删除作品
 */

const {updateWorkService} = require("../../services/works")
const {deleteWorkFailInfo, deleteWorkDbErrorFailInfo} = require('../../res-model/failInfo')
const {ErrorRes, SuccessRes} = require("../../res-model/index")

/**
 * @description 删除作品
 * @param {string} id
 * @param {string} author
 * @param {boolean} putBack // 恢复删除，默认 false
 */
async function deleteWork(id, author, putBack = false) {
    let res
    try {
        // 假删除 更新status
        const status = putBack === true ? 1 : 0
        res = await updateWorkService(
            {status},
            {id, author}
        )
    } catch (ex) {
        console.error('删除作品错误', ex)
        return new ErrorRes(deleteWorkDbErrorFailInfo)
    }

    if (res) return new SuccessRes()
    return new ErrorRes(deleteWorkFailInfo, 'id 或 author 不匹配')
}

/**
 * @description 恢复删除
 * @param {string} id
 * @param {string} author
 */
async function pubBackWork(id, author) {
    const res = await deleteWork(id, author, true)
    return res
}

module.exports = {
    deleteWork,
    pubBackWork
}