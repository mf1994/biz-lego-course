/**
 * @description 查询作品
 */

const {ErrorRes, SuccessRes} = require("../../res-model/index")
const {findOneWorkFailInfo, findOneWorkDbErrorFailInfo} = require("../../res-model/failInfo")
const {findOneWorkService, findWorkListService} = require("../../services/works")
const {DEFAULT_PAGE_SIZE} = require("../../config/envs/constant")

/**
 * @description 查询单个作品
 * @param {string} id
 * @param {string} author
 */
async function findOneWork(id, author) {
    if (!id || !author) {
        return new ErrorRes(findOneWorkFailInfo, 'id 或者 author为空！')
    }
    let work
    try {
        work = await findOneWorkService({
            id,
            author
        })
    } catch (ex) {
        console.error('查询单个作品失败', ex)
        return new ErrorRes(findOneWorkDbErrorFailInfo) // 数据库错误
    }
    if (work == null) {
        return new ErrorRes(findOneWorkFailInfo, 'id 或者 author不匹配！')
    }
    return new SuccessRes(work)
}

/**
 * @description 获取自己的作品或模板
 * @param {string} author
 * @param {object} queryInfo
 * @param {object} pageInfo
 */
async function findMyWorks(author, queryInfo = {}, pageInfo = {}) {
    const {id, uuid, title, status, isTemplate } = queryInfo
    let {pageIndex, pageSize} = pageInfo
    pageIndex = parseInt(pageIndex, 10) || 0
    pageSize = parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE

    const {list, count} = await findWorkListService(
        {
            id,
            uuid,
            title,
            status,
            author,
            isTemplate: isTemplate === '1',
        },
        {
            pageIndex,
            pageSize
        }
    )
    return new SuccessRes({list, count})
}

module.exports = {
    findOneWork,
    findMyWorks
}