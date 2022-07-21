/**
 * @description 工具函数
 */

const _ = require("lodash")
const os = require("os")

module.exports = {
    // 判断 windows 系统
    isWindows: os.type().toLowerCase().indexOf('windows') >= 0,
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