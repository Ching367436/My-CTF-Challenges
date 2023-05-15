const express = require('express')
const eta = require('eta')
const app = express()
const sqlite3 = require('sqlite3')
const session = require('express-session')
const crypto = require('crypto')
const fileUpload = require('express-fileupload')
const net = require('net')
const bodyParser = require('body-parser')

// reCAPTCHA
const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'
const Recaptcha = require('express-recaptcha').RecaptchaV2
const recaptcha = new Recaptcha(RECAPTCHA_SITE_KEY, RECAPTCHA_SECRET_KEY)

// constants
const BOT_HOST = process.env.BOT_HOST || 'localhost'
const BOT_PORT = process.env.BOT_PORT || 7777
const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 8000

// configure eta
app.engine("eta", eta.renderFile)
eta.configure({ views: "./views", cache: false })
app.set("views", "./views")
app.set("view cache", false)
app.set("view engine", "eta")

// sqlite3
// const db = new sqlite3.Database('./db.sqlite3')
const db = new sqlite3.Database(':memory:')
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY, 
        username TEXT, 
        password TEXT, 
        avatar TEXT DEFAULT 'avatars/AIS3logo.png',
        about TEXT DEFAULT '<h5>Hello!</h5>\nI am a <span style="color: red;">new</span> user.'
        )`);
})

// csp
app.use((req, res, next) => {
    res.set("X-Content-Type-Options", "nosniff")
    res.set("X-Frame-Options", "DENY")
    res.set("X-XSS-Protection", "1; mode=block")
    const nonce = crypto.randomBytes(32).toString('hex')
    res.nonce = nonce
    res.set("Content-Security-Policy",
        `\
    default-src 'none'; \
    script-src 'nonce-${nonce}' https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js https://*.googletagmanager.com https://*.google.com https://*.gstatic.com https://cdnjs.cloudflare.com/ajax/libs/dompurify/ https://w3c.github.io/trusted-types/ https://*.clarity.ms https://c.bing.com ; \
    style-src https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css 'unsafe-inline'; \
    connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.clarity.ms https://c.bing.com ; \
    img-src 'self' blob: data: https://*.google-analytics.com https://*.googletagmanager.com https://*.clarity.ms https://c.bing.com ; \
    frame-src https://*.google.com https://*.gstatic.com ; \
    base-uri 'none' ; \
    require-trusted-types-for 'script' ; \
    trusted-types default dompurify recaptcha goog#html ; \
    `);
    next()
})

// static files
app.use(express.static('public'))

// configure express-session
app.use(session({
    secret: crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: true,
        httpOnly: true,
        maxAge: 86400 * 1000
    }
}))

// form
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

// file upload
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
}));

app.get("/", (req, res) => {
    if (req.session.username) {
        return res.redirect("/portfolio")
    }
    return res.redirect("/login")
})

app.get("/login", (req, res) => {
    return res.render("login", { nonce: res.nonce })
})

app.post("/api/login", (req, res) => {
    const { username, password } = req.body
    if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
        return res.status(400).json({ success: false, message: "Bad request" })
    }
    db.get("SELECT username, password FROM Users WHERE username = ?", username,
        (err, row) => {
            if (err)
                return res.status(500).json({ success: false, message: "Internal server error" })
            if (row && row.password === password) {
                req.session.username = username
                return res.json({ success: true, message: "Logged in" })
            }
            if (row) {
                return res.status(401).json({ success: false, message: "Wrong password" })
            } else {
                // register
                db.run("INSERT INTO Users (username, password) VALUES (?, ?)", username, password, (err) => {
                    if (err)
                        return res.status(500).json({ success: false, message: "Internal server error" })
                    req.session.username = username
                    return res.json({ success: true, message: "Registered" })
                })
            }

        })
})

app.get("/portfolio", (req, res) => {
    if (!req.session.username)
        return res.redirect("/login")
    res.render("portfolio", { nonce: res.nonce, RECAPTCHA_SITE_KEY })
})

app.get("/api/portfolio", (req, res) => {
    if (!req.session.username)
        return res.status(401).json({ success: false, message: "Unauthorized" })
    db.get("SELECT * FROM Users WHERE username = ?", req.session.username, (err, row) => {
        if (err)
            return res.status(500).json({ success: false, message: "Internal server error" })
        if (!row)
            return res.status(404).json({ success: false, message: "Not found" })
        return res.json({ success: true, data: row })
    })
})

app.put("/api/portfolio", (req, res) => {
    if (!req.session.username)
        return res.status(401).json({ success: false, message: "Unauthorized" })
    const updateAbout = () => {
        if (typeof req.body.about !== 'string')
            return res.status(400).json({ success: false, message: "Bad request" })
        db.run("UPDATE Users SET about = ? WHERE username = ?", req.body.about, req.session.username, (err) => {
            if (err)
                return res.status(500).json({ success: false, message: "Internal server error" })
            return res.json({ success: true })
        })
    }
    const ALLOWED_MIMES = ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml', 'image/webp']
    const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp']
    if (req.files && req.files.avatar) {
        const ext = req.files.avatar.name.split('.').pop()
        if (ALLOWED_MIMES.indexOf(req.files.avatar.mimetype) === -1 || ALLOWED_EXTENSIONS.indexOf(ext) === -1)
            return res.status(400).json({ success: false, message: "We currently only support PNG, JPEG, GIF, SVG and WEBP." })
        const filename = req.files.avatar.md5 + '.' + ext
        req.files.avatar.mv(`public/avatars/${filename}`, (err) => {
            if (err)
                return res.status(500).json({ success: false, message: "Internal server error: cannot mv avatar to public folder" })
            db.run("UPDATE Users SET avatar = ? WHERE username = ?", `avatars/${filename}`, req.session.username, (err) => {
                if (err)
                    return res.status(500).json({ success: false, message: "Internal server error: cannot update avatar path" + err })
                updateAbout()
            })
        })
    } else {
        updateAbout()
    }
})

app.get("/share", (req, res) => {
    res.render("share", { nonce: res.nonce })
})

app.get("/api/share", (req, res) => {
    if (req.query.username === undefined || typeof req.query.username !== 'string')
        return res.status(400).json({ success: false, message: "Bad request" })
    db.get("SELECT username, about, avatar FROM Users WHERE username = ?", req.query.username, (err, row) => {
        if (err)
            return res.status(500).json({ success: false, message: "Internal server error" })
        if (!row)
            return res.status(404).json({ success: false, message: "Not found" })
        return res.json({ success: true, data: row })
    })
})

app.post("/api/logout", (req, res) => {
    req.session.destroy()
    res.json({ success: true })
})

app.post("/api/report", recaptcha.middleware.verify, (req, res) => {
    if (!req.body.url || typeof req.body.url !== 'string')
        return res.status(400).json({ success: false, message: "Invalid URL" })
    if (req.recaptcha.error) {
        console.error(req.recaptcha.error)
        return res.status(400).json({ success: false, message: "Invalid recaptcha" })
    }
    const url = new URL(req.body.url)
    url.host = HOST

    try {
        const client = net.connect(BOT_PORT, BOT_HOST, () => {
            client.write(url.href)
        })
        let result
        client.on('data', (data) => {
            result = data.toString()
            client.end()
        })
        client.on('error', (err) => {
            console.error(err)
            return res.status(500).json({ success: false, message: "Internal server error" })
        })
        client.on('end', () => {
            return res.json({ success: true, data: result })
        })
    } catch (e) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
})

process.on('exit', () => {
    db.close();
})

app.listen(PORT, () => {
    console.log("Listening on port", PORT)
})