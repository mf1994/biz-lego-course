/**
 * @description 发布作品 缓存
 */

const {cacheSet} = require("../index")

const PREFIX = 'publishWorkId-'

/**
 * @description 发布作品，缓存失效
 * @param {string} id
 */
function publishWorkClearCache(id) {
    const key = `${PREFIX}${id}`
    cacheSet(
        key,
        ''
    )
}

module.exports = {
    publishWorkClearCache
}