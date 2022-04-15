/**
 * @description 连接redis
 */
const redis = require('redis')
const {redisConf} = require('../config/index')

// 创建客户端
const {host, port, password} = redisConf
const opt = {}
if (password) {
    opt.password = password // prd环境需要密码
}
const redisClient = redis.createClient(port, host, opt)
redisClient.on('error', err => {
    console.error('redis connect error', err)
})

// redisClient.on('connect', () => {
//     console.log('redis connect success')
// })

module.exports = redisClient