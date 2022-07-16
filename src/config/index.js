/**
 * @description 配置项
 */
let {isPrd, isPrdDev} = require('../utils/env')

// 获取各个环境不同的配置文件
let fileName = 'dev.js'
isPrdDev = true
if (isPrdDev) fileName = 'prd-dev.js'
// if (isPrd) fileName = 'prd.js'

const conf = require(`./envs/${fileName}`)

module.exports = conf