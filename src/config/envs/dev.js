/**
 * @description dev 配置
 */

module.exports = {
    // mysql连接配置
    mysqlConf: {
        host: 'localhost',
        user: 'root',
        password: '123456',
        port: '3306',
        database: 'imooc-lego-course'
    },
    // mongodb 连接配置
    mongodbConf: {
        host: 'localhost',
        port: '27017',
        dbName: 'imooc-logo-course'
    },
    // redis 连接配置
    redisConf: {
        port: '6379',
        host: '127.0.0.1'
    },
    // jwt 过期时间
    jwtExpiresIn: '1d', // 1. 字符串，如 '1h' '2d'； 2. 数字，单位是 s

    // 短信验证码缓存时间
    msgVeriCodeTimeout: 2 * 60,

    // 阿里云OSS配置
    aliyunOSSConf: {
        accessKeyId: 'LTAI5tLWWhuCDRLZuiqivbP8',
        accessKeySecret: 'Km4P7ox5xD6sswkQYKLvswoXoNeaZV',
        bucket: 'imooc-lego-123',
        region: 'oss-cn-hangzhou'
    }
}