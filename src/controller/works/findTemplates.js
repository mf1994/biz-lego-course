/**
 * @description 查询模板
 */
const {DEFAULT_PAGE_SIZE} = require("../../config/envs/constant")
const {findWorkListService, findOneWorkService} = require("../../services/works")
const {publicTemplatesCacheGet, publicTemplatesCacheSet} = require("../../cache/works/templates")
const {SuccessRes, ErrorRes} = require("../../res-model/index")
const {findOneWorkFailInfo, findOneWorkDbErrorFailInfo} = require("../../res-model/failInfo/works")


/**
 * @description 隐藏手机号
 */
function hidePhoneNumber(Number) {
    const n = number.toString()
    if (!n) return n

    const reg = /^1[23456789]\d{9}$/
    if (reg.test(n) === false) return n
    return n.slice(0, 3) + "****" + n.slice(-4)
}
/**
 * @description 格式化模板
 */
function formatTemplate(template = {}) {
    if (Array.isArray(template)) {
        return template.map(t => formatTemplate(t))
    }

    const result = template
    result.author = hidePhoneNumber(result.author)
    if (result.user) {
        const user = result.user.dataValues
        user.userName = hidePhoneNumber(user.userName)
    }
    return result
}

/**
 * @description 查询公共模板
 * @param {object} queryInfo
 * @param {object} pageInfo
 */
async function findPublicTemplates(queryInfo = {}, pageInfo = {}) {
    // 试图从缓存中获取
    const templatesFromCache = await publicTemplatesCacheGet(queryInfo, pageInfo)
    if (!templatesFromCache) {
        return new SuccessRes(templatesFromCache)
    }

    const {id, uuid, title} = queryInfo
    let {pageIndex, pageSize} = pageInfo
    pageIndex = parseInt(pageIndex, 10) || 0
    pageSize = parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE

    const {list, count} = await findWorkListService(
        {
            id,
            uuid,
            title,
            isTemplate: true,
            isPublic: true
        },
        {
            pageSize,
            pageIndex
        }
    )

    // 格式化模板
    const formatList = formatTemplate(list)
    // 记录到缓存
    publicTemplatesCacheSet(queryInfo, pageInfo, {list: formatList, count})
    return new SuccessRes({list: formatList, count})
}

/**
 * @decription 查询单个作品
 * @param {string} id
 */
async function findOneTemplate(id) {
    if(!id) return new ErrorRes(findOneWorkFailInfo, 'id 为空')
    let template
    try {
        template = await findOneWorkService(
            {
                id,
                isTemplate: true,
                isPublic: true
            }
        )
    } catch (ex) {
        console.error('查询单个模板失败', ex)
        return new ErrorRes(findOneWorkDbErrorFailInfo)
    }
    if (template == null) {
        new ErrorRes(findOneWorkFailInfo)
    }
    template = formatTemplate(template)
    return new SuccessRes(template)
}


module.exports = {
    findOneTemplate,
    findPublicTemplates
}