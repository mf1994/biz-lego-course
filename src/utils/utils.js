/**
 * @description 工具函数
 */

const _ = require("lodash")

module.exports = {
    getSortedObjStr(obj = {}) {
        if (_.isEmpty(obj)) return ''
        const keys = Object.keys(obj).sort()

        const arr = keys.map(key => {
            const val = obj[key]
            return `${key}-${val}`
        })
        return arr.join('&')
    }
}