/**
 * @description 上传图片
 */

const formidable = require("formidable")
const uploadOSS = require("../../vendor/uploadOSS")
const _ = require("lodash")
const fs = require('fs')
const {uploadImgFailInfo} = require("../../res-model/failInfo/index")
const {ErrorRes, SuccessRes} = require("../../res-model/index")
const {isWindows} = require("../../utils/utils")

const form = formidable({multiples: true})

const TMP_PATH_WINDOWS = 'tmp-files-windows'

// windows 系统，处理 rename 报错
if (isWindows) {
    const tmpPath = path.resolve(__dirname, '..', '..', '..', TMP_PATH_WINDOWS)
    if (!fs.existsSync(tmpPath)) {
        fs.mkdirSync(tmpPath)
    }
    form.uploadDir = TMP_PATH_WINDOWS
}

/**
 * @description 添加后缀
 * @param {string} fileName
 * @param {string} originalFilename
 */
function addSuffixForFileName(fileName = '') {
    const suffix = Math.random().toString().slice(-6)
    if (!fileName) return ''
    const lastPointIndex = fileName.lastIndexOf('.')
    if (lastPointIndex < 0) {
        return `${fileName}-${suffix}`
    }
    return `${fileName.slice(0, lastPointIndex)}-${suffix}${fileName.slice(lastPointIndex)}`
}

/**
 * @description 通过formidable上传图片
 * @param {object} req
 */
function uploadImgByFormidable(req) {
    const p = new Promise((resolve, reject) => {
        form.parse(req, async function upload(err, fields, files) {
            if (err) {
                reject(err)
            }
            // 遍历所有图片上传
            const filesKeys = Object.keys(files)
            try {
                const links = await Promise.all(
                    filesKeys.map(name => {
                        const file = files[name]
                        let fileName = file.name || name
                        fileName = addSuffixForFileName(file.originalFilename)
                        return uploadOSS(fileName, file.filepath)
                    })
                )
                // 删除源文件
                _.forEach(files, file => {
                    fs.unlinkSync(file.filepath)
                })
                resolve(links)
            } catch (ex) {
                reject(ex)
            }
        })
    })
    return p
}

/**
 * @description 上传图片
 * @param {object} req  ctx.req
 */
async function uploadImg(req) {
    let urls
    try {
        urls = await uploadImgByFormidable(req)
    } catch (ex) {
        console.error("上传图片错误", ex)
        return new ErrorRes(uploadImgFailInfo)
    }
    return new SuccessRes(urls)
}

module.exports = {
    uploadImg
}