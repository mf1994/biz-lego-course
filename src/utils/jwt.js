/**
 * @description jwt verify
 */

const util = require('util')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/envs/constant')
const {jwtExpiresIn} = require('../config/envs/dev')

const verify = util.promisify(jwt.verify)

/**
 * @description verify
 * @param {string} token
 */
async function jwtVerify(token) {
    const data = await verify(token.split(' ')[1], JWT_SECRET)
    return data
}
/**
 * @description sign
 * @param {object} data
 */
function jwtSign(data) {
    const token = jwt.sign(data, JWT_SECRET, {expiresIn: jwtExpiresIn})
    return token
}

module.exports = {
    jwtVerify,
    jwtSign
}