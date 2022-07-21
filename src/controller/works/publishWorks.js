/**
 * @description 发布作品
 */

const {findOneWorkService, updatePublishContentService, updateWorkService} = require("../../services/works")
const {ErrorRes, SuccessRes} = require("../../res-model/index")
const {publishWorkFailInfo, publishWorkDbErrorFailInfo, forceOffLineFailInfo} = require("../../res-model/failInfo/index")
const {publishWorkClearCache} = require("../../cache/works/publish")
const {h5Origin} = require("../../config/index")

/**
 * @description 发布作品
 * @param {string} id
 * @param {string} author
 * @param {boolean} isTemplate
 */
async function publishWork(id, author, isTemplate = false) {
    const work = await findOneWorkService({
        id,
        author
    })
    if (work == null) return new ErrorRes(publishWorkFailInfo, 'id或author不匹配！')
    // 是否强制下线
    if (parseInt(work.status, 10) === 3) {
        return new ErrorRes(forceOffLineFailInfo)
    }

    // 发布
    const updateData = {
        status: 2,
        latestPublishAt: new Date()
    }
    if (isTemplate) {
        Object.assign(updateData, {
            isTemplate: true
        })
    }

    let result
    try {
        // 更新发布内容
        const publishContentId = await updatePublishContentService(
            work.content,
            work.publishContentId
        )
        // 发布项目
        result = await updateWorkService(
            {
                publishContentId,
                ...updateData
            },
            {
                id,
                author
            }
        )
    } catch (ex) {
        console.error("发布作品错误", id, ex)
        return new ErrorRes(publishWorkDbErrorFailInfo)
    }
    if (!result) return new ErrorRes(publishWorkFailInfo)

    // 重新发布，需要清空缓存
    publishWorkClearCache(id)

    // 发布成功，返回链接
    const url = `${h5Origin}/p/${work.id}-${work.uuid}`
    return new SuccessRes({
        url
    })
}

module.exports = {
    publishWork
}