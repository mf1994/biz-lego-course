/**
 * @description 公共模板
 */

const {cacheSet, cacheGet} = require("../index")
const {getSortedObjStr} = require("../../utils/utils")

/**
 * @description 获取key
 * @param {object} queryInfo
 * @param {object} pageInfo
 */
function getCacheKey(queryInfo = {}, pageInfo = {}) {
    const PREFIX = "public-templates-"
    const queryInfoStr = getSortedObjStr(queryInfo)
    const pageInfoStr = getSortedObjStr(pageInfo)
    const key = `${PREFIX}${queryInfoStr}${pageInfoStr}`
    return key
}

/**
 * @description 缓存set
 * @param {object} queryInfo
 * @param {object} pageInfoHU
 * @param {object} templates
 */
function publicTemplatesCacheSet(queryInfo = {}, pageInfo = {}, templates) {
    if (templates == null) return
    const key = getCacheKey(queryInfo, pageInfo)
    cacheSet(
        key,
        templates,
        120
    )
}

/**
 * @description 缓存get
 * @param {object} queryInfo
 * @param {object} pageInfo
 */
async function publicTemplatesCacheGet(queryInfo = {}, pageInfo = {}) {
    const key = getCacheKey(queryInfo, pageInfo)
    const templates = await cacheGet(key)
    if (!templates) return null
    return templates
}

module.exports = {
    publicTemplatesCacheGet,
    publicTemplatesCacheSet
}