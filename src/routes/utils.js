/**
 * @description 路由 工具类
 */
const router = require("koa-router")()

// 中间件
const loginCheck = require("../middlewares/loginCheck")

const {uploadImg} = require("../controller/utils/uploadImg")

router.prefix('/api/utils')

// 上传图片
router.post('/upload-img', loginCheck, async ctx => {
    const res = await uploadImg(ctx.req)
    ctx.body = res
})

module.exports = router