/**
 * @description 数据校验 作品
 */

// 普通数据规则
const strRule = {
    type: 'string',
    maxLength: 255
}
const numRule = {
    type: 'number'
}
const boolRule = {
    type: 'boolean'
}

// 创建作品schema
const workInfoSchema = {
    type: 'object',
    required: ['title'],
    properties: {
        title: strRule,
        desc: strRule,
        coverImg: strRule,
        contentId: strRule,
        // 作品内容 —— 这个并不在 WorksModel 中！！！
        content: {
            type: 'object',
            properties: {
                _id: strRule,
                components: {
                    type: 'array'
                },
                props: {
                    type: 'object'
                },
                setting: {
                    type: 'object'
                }
            }
        }
    }
}

module.exports = {
    workInfoSchema
}