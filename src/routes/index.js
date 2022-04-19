const router = require('koa-router')()
const {ENV} = require('../utils/env')
const packageInfo = require('../../package.json')
const testMysqlConn = require('../db/mysql2')
const {WorkModel} = require("../models/WorkModel")
const {cacheSet, cacheGet} = require('../cache/index')

// 测试数据库连接
router.get('/api/db-check', async ctx => {
    // 测试mysql连接
    const mysqlRes = await testMysqlConn()
    // 测试mongodb连接
    let mongodbConn
    try {
        mongodbConn = true
        await WorkModel.findOne()
    } catch (ex) {
        mongodbConn = false
    }
    // 测试redis连接
    cacheSet('name', 'biz editor server OK - by redis')
    const redisTestVal = await cacheGet('name')
    ctx.body = {
        errno: 0,
        data: {
            name: 'biz editor serve',
            version: packageInfo.version,
            ENV,
            mysqlConn: mysqlRes.length > 0,
            mongodbConn,
            redisConn: redisTestVal != null
        }
    }
})

module.exports = router