const mongoose = require('../db/mongoose')

const contentSchema = mongoose.Schema(
    {
        // mongodb 会自动生成_id, 不用自己专门定义
        // 标题
        title: String,
        // 页面的组件列表
        components: [Object],
        // 页面的属性，保证扩展性
        props: Object,
        // 配置信息，保证扩展性
        setting: Object
    },
    {timestamps: true}
)

// 未发布的内容
const WorkContentModel = mongoose.model('workContent', contentSchema)

// 发布的内容
const WorkPublishContentModel = mongoose.model('workPublishContent', contentSchema)

module.exports = {
    WorkContentModel,
    WorkPublishContentModel
}