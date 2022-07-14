/**
 * @description 创建作品
 */

const {v4: uuidV4 } = require('uuid')
const {createWorksService, findOneWorkService, updateWorkService} = require("../../services/works")
const {ErrorRes, SuccessRes} = require("../../res-model/index")
const {createWorksFailInfo, createWorksDbErrorFailInfo, forceOffLineFailInfo} = require("../../res-model/failInfo/index")

/**
 * @description 创建作品
 * @param {string} author
 * @param {object} data
 * @param {object} content
 */
async function createWorks(author, data = {}, content = {}) {
    const {title} = data
    if (!title) {
        return new ErrorRes(createWorksFailInfo, '标题不能为空')
    }

    const uuid = uuidV4().slice(4)
    try {
        const newWork = await createWorksService(
            {
                ...data,
                author,
                uuid
            },
            content
        )
        // 创建成功
        return new SuccessRes(newWork)
    } catch (ex) {
        console.error('创建作品失败', ex)
        return new ErrorRes(createWorksDbErrorFailInfo)
    }
}

/**
 * @description 复制作品
 * @param {string} id
 * @param {string} username
 */
async function copyWorks(id, author) {
    const work = await findOneWorkService({id}) // 被复制的项目不一定是自己的，所以查询条件**不加 author**
    // 是否强制下线
    if (parseInt(work.status, 10) === 3) {
        return new ErrorRes(forceOffLineFailInfo)
    }

    const {content} = work
    const newData = {
        title: `${work.title}-复制`,
        desc: work.desc,
        coverImg: work.coverImg
    }

    // 创建新项目
    const res = await createWorks(author, newData, content)

    // 更新原项目的使用次数
    await updateWorkService(
        {
            copiedCount: work.copiedCount + 1
        },
        {
            id
        }
    )

    // 返回新项目
    return res
}

module.exports = {
    createWorks,
    copyWorks
}