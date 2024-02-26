const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
var aesjs = require('aes-js');
const fs = require('fs');
var minify = require('express-minify');


const PORT = process.env.PORT || 65365;
const app = express();
// app.use(minify());
app.use(session({
    secret: crypto.randomBytes(64).toString('hex'),
    resave: true,
    saveUninitialized: false,
}))

app.get('/', (req, res) => {
    if (!req.session.initialized) {
        req.session.initialized = true;
    }
    res.sendFile(__dirname + '/private/index.html');
})

app.get('/init', (req, res) => {
    if (!req.session.initialized) {
        return res.redirect('https://youtu.be/dQw4w9WgXcQ');
    }

    const antiDebugJS = fs.readFileSync(__dirname + '/private/anti-debug.js', 'utf8');
    return res.send(encrypt(antiDebugJS));
});

app.get('/rickroll', (req, res) => {
    console.log(req.session)
    console.log(req.query)
    req.session.isHacker = true;
    res.redirect('https://youtu.be/dQw4w9WgXcQ');
});

function encrypt(text) {
    // An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
    var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

    // Convert text to bytes
    var textBytes = aesjs.utils.utf8.toBytes(text);

    // The counter is optional, and if omitted will begin at 1
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var encryptedBytes = aesCtr.encrypt(textBytes);

    // To print or store the binary data, you may convert it to hex
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    return encryptedHex;
}

function decrypt(encryptedHex) {
    var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    // When ready to decrypt the hex string, convert it back to bytes
    var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

    // The counter mode of operation maintains internal state, so to
    // decrypt a new instance must be instantiated.
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var decryptedBytes = aesCtr.decrypt(encryptedBytes);

    // Convert our bytes back into text
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    console.log(decryptedText);
    // "Text may be any length you wish, no padding is required."
}

app.delete('/check-flag', (req, res) => {
    console.log(btoa(req.query.flag));
    if (!req.session.initialized) {
        return res.redirect('https://youtu.be/dQw4w9WgXcQ');
    }
    if (req.session.isHacker) {
        const rickrollJS = fs.readFileSync(__dirname + '/private/rickroll.js', 'utf8');
        return res.send(encrypt(rickrollJS));
    }
    const checkFlagJS = fs.readFileSync(__dirname + '/private/checkFlag.js', 'utf8');
    return res.send(encrypt(checkFlagJS));
});

app.use('/', express.static(__dirname + '/static'));

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
})