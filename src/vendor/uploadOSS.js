/**
 * @description 上传文件到OSS
 */

const fs = require('fs')
const OSS = require("ali-oss")
const {aliyunOSSConf} = require("../config/envs/dev")

const client = new OSS(aliyunOSSConf)

/**
 * @description 上传文件到oss
 * @param {string} fileName
 * @param {string} filePath
 */
async function uploadOSS(fileName, filePath) {
    const stream = fs.createReadStream(filePath)
    try {
        const folder = 'upload-files'
        const res = await client.putStream(`${folder}/${fileName}`, stream)
        return res.url
    } catch (ex) {
        console.error('阿里云上传错误', ex)
        throw new Error('阿里云上传错误')
    }
}

module.exports = uploadOSS