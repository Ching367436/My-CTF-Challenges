const express = require('express')
const session = require('express-session')
const eta = require('eta')
const crypto = require('crypto')
const sqlite3 = require('sqlite3');

// constants
const ADMIN_PASSWORD = crypto.randomBytes(16).toString('hex')
const FLAG = process.env.FLAG ?? 'AIS3{fake_flag}'
const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'
const PORT = process.env.PORT || 8000
const ADMIN_2FA_CODE = crypto.randomInt(10000000000000, 100000000000000).toString()

const Recaptcha = require('express-recaptcha').RecaptchaV2
const recaptcha = new Recaptcha(RECAPTCHA_SITE_KEY, RECAPTCHA_SECRET_KEY)

// configure Eta
const app = express()
app.engine('eta', eta.renderFile)
eta.configure({ views: './views', cache: true })
app.set('views', './views')
app.set('view cache', true)
app.set('view engine', 'eta')

// configure express-session
app.use(session({
    secret: crypto.randomBytes(64).toString('hex'),
    resave: false,
    saveUninitialized: false,
}))

// receive data from forms
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// db
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, code TEXT)");
    db.run("INSERT INTO Users (username, password, code) VALUES ('admin', ?, ?)", ADMIN_PASSWORD, ADMIN_2FA_CODE);
    db.run("INSERT INTO Users (username, password, code) VALUES ('guest', 'guest', '99999999999999')");
});

app.get('/', (req, res) => {
    res.redirect('/login')
})

app.get('/login', (req, res) => {
    res.render('login', {
        msg: req.query.msg,
        RECAPTCHA_SITE_KEY
    })
})

app.post('/login', recaptcha.middleware.verify, (req, res) => {
    const { username, password } = req.body
    db.get(`SELECT * FROM Users WHERE username = '${username}' AND password = '${password}'`, async (err, row) => {
        if (err) return res.redirect(`https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
        if (!row) return res.redirect(`/login?msg=invalid_credentials`)
        if (row.username !== username) {
            // special case
            return res.redirect(`https://www.youtube.com/watch?v=E6jbBLrxY1U`)
        }
        if (req.recaptcha.error) {
            console.log(req.recaptcha.error)
            return res.redirect(`/login?msg=invalid_captcha`)
        }
        req.session.username = username
        return res.redirect('/2fa')
    })
})

app.get('/2fa', (req, res) => {
    if (req.session.username) {
        return res.render('2fa', {
            msg: req.query.msg
        })
    }
    return res.redirect('/login')
})

app.post('/2fa', (req, res) => {
    if (req.session.username) {
        const { code } = req.body
        db.get(`SELECT code FROM Users WHERE username = '${req.session.username}'`, (err, row) => {
            if (err)
                return res.redirect(`https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
            if (row.code === code)
                return res.redirect('/dashboard')
            return res.redirect('/2fa?msg=invalid_code')
        })
    } else {
        return res.redirect('/login')
    }
})

app.get('/dashboard', (req, res) => {
    if (req.session.username) {
        return res.render('dashboard', {
            username: req.session.username,
            flag: FLAG
        })
    }
    return res.redirect('/')
})

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

process.on('exit', function () {
    db.close();
});

app.listen(PORT, () => {
    console.log('listening to requests on port', PORT)
})