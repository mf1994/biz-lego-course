/**
 * @description 模板相关接口
 */

const router = require('koa-router')()

// controller
const {findOneTemplate, findPublicTemplates} = require("../controller/works/findTemplates")

router.prefix("/api/templates")

// 获取公共模板
router.get('/', async ctx => {
    const {title, pageSize, pageIndex} = ctx.query
    const res = await findPublicTemplates({title}, {pageIndex, pageSize})
    ctx.body = res
})

// 查询单个公共模板 
router.get('/:id', async ctx => {
    const {id} = ctx.params
    const res = await findOneTemplate(id)
    ctx.body = res
})

module.exports = router