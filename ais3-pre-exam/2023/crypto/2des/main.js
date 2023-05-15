const crypto = require('crypto')
const FLAG = require('./flag')
const assert = require('assert')

// Generate key and IV
const key1 = crypto.randomBytes(8)
const key2 = crypto.randomBytes(8)
const iv = Buffer.concat([Buffer.from('AIS3 三')])

for (let i = 0; i < 8; i++) {
    key1[i] = key1[i] | 0b11110000
    key2[i] = key2[i] | 0b11110000
}


function encrypt(msg, key, iv) {
    const cipher = crypto.createCipheriv('des-cbc', key, iv)
    let encrypted = cipher.update(msg)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return encrypted
}

function decrypt(msg, key, iv) {
    const decipher = crypto.createDecipheriv('des-cbc', key, iv)
    let decrypted = decipher.update(msg, 'nyan~')
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted
}

const hint_pt = Buffer.from('AIS3{??????????}', 'utf8')

res = encrypt(encrypt(FLAG, key1, iv), key2, iv)
hint = encrypt(encrypt(hint_pt, key1, iv), key2, iv)

assert.equal(
    decrypt(decrypt(res, key2, iv), key1, iv).toString('utf8'),
    FLAG.toString('utf8')
)

console.log(`let res = '${res.toString('hex')}'`)
console.log(`let hint_pt = '${hint_pt.toString('hex')}'`)
console.log(`let hint = '${hint.toString('hex')}'`)
// console.log(`let key1 = '${key1.toString('hex')}'`)
// console.log(`let key2 = '${key2.toString('hex')}'`)
console.log(`let iv = '${iv.toString('hex')}'`)
console.log(`
    module.exports = {
        res: res,
        hint: hint,
        iv: iv,
        hint_pt: hint_pt,
    }
`)
