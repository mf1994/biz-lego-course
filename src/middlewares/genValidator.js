/**
 * @description 生成ctx.request.body 格式校验的中间件
 */

const Ajv = require('ajv')
const {ErrorRes} = require('../res-model/index')
const {validateFailInfo} = require('../res-model/failInfo/index')

const ajv = new Ajv({
    allErrors: true, // 输出所有错误
})

/**
 * @description json schema 校验
 * @param {Object} schema json schema 规则
 * @param {Object} data 待校验的数据
 * @returns {Array|undefined} 错误信息｜undefined 
 */
function validate(schema, data = {}) {
    const valid = ajv.validate(schema, data)
    if (!valid) {
        return ajv.errors
    }
    return undefined
}

/**
 * @description 生成校验中间件
 */
function genValidator(schema) {
    async function validator(ctx, next) {
        const data = ctx.request.body
        const validateError = validate(schema, data)
        if (validateError) {
            // 校验失败
            ctx.body = new ErrorRes({
                ...validateFailInfo,
                data: validateError
            })
            return
        }
        // 校验成功
        await next()
    }
    return validator
}

module.exports = genValidator
