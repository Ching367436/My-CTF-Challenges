const crypto = require('crypto')
let { res, hint, iv, hint_pt } = require('./output')

iv = Buffer.from(iv, 'hex')
res = Buffer.from(res, 'hex')
hint = Buffer.from(hint, 'hex')
hint_pt = Buffer.from(hint_pt, 'hex')

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

function solve() {
    const middle = new Map()
    console.log('Generating middle map...')
    for (let a = 0b11110000; a < 0b11111111; a+=2)
    {
        process.stdout.write(`a = ${a}\r`)
        for (let b = 0b11110000; b < 0b11111111; b+=2)
        for (let c = 0b11110000; c < 0b11111111; c+=2)
        for (let d = 0b11110000; d < 0b11111111; d+=2)
        for (let f = 0b11110000; f < 0b11111111; f+=2)
        for (let g = 0b11110000; g < 0b11111111; g+=2)
        for (let h = 0b11110000; h < 0b11111111; h+=2)
        for (let i = 0b11110000; i < 0b11111111; i+=2)
        {
            const key1 = Buffer.from([a, b, c, d, f, g, h, i])
            const encrypted = encrypt(hint_pt, key1, iv)
                middle.set(encrypted.toString('hex'), key1)
        }
    }
        
    
    console.log('Brute forcing...')
    for (let a = 0b11110000; a < 0b11111111; a+=2)
    {
        process.stdout.write(`a = ${a}\r`)
        for (let b = 0b11110000; b < 0b11111111; b+=2)
        for (let c = 0b11110000; c < 0b11111111; c+=2)
        for (let d = 0b11110000; d < 0b11111111; d+=2)
        for (let f = 0b11110000; f < 0b11111111; f+=2)
        for (let g = 0b11110000; g < 0b11111111; g+=2)
        for (let h = 0b11110000; h < 0b11111111; h+=2)
        for (let i = 0b11110000; i < 0b11111111; i+=2)
        {
            const key2 = Buffer.from([a, b, c, d, f, g, h, i])
            try {
                const decrypted = decrypt(hint, key2, iv).toString('hex')
                if (middle.has(decrypted)) {
                    const key1 = middle.get(decrypted)
                    console.log(key1.toString('hex'))
                    const flag = decrypt(decrypt(res, key2, iv), key1, iv)
                    console.log(flag.toString('utf8'))
                    return
                }
            } catch (e) {
                // console.log(e)
            }
        }
    }
}

solve()