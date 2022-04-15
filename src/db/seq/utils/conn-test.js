
const seq = require('../seq')

seq.authenticate().then(() => {
    console.log('ok')
}).catch(() => {
    console.log('fail')
}).finally(() => {
    process.exit()
})