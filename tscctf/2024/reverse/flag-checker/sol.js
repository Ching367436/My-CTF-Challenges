function SHA1(r) {
    function e(r, e) { return r << e | r >>> 32 - e } function t(r) { var e, t = ""; for (e = 7; e >= 0; e--)t += (r >>> 4 * e & 15).toString(16); return t } var n, o, a, h, c, f, C, u, i, d = new Array(80), g = 1732584193, s = 4023233417, A = 2562383102, l = 271733878, S = 3285377520, b = (r = function (r) { r = r.replace(/\\r\\n/g, "\\n"); for (var e = "", t = 0; t < r.length; t++) { var n = r.charCodeAt(t); n < 128 ? e += String.fromCharCode(n) : n > 127 && n < 2048 ? (e += String.fromCharCode(n >> 6 | 192), e += String.fromCharCode(63 & n | 128)) : (e += String.fromCharCode(n >> 12 | 224), e += String.fromCharCode(n >> 6 & 63 | 128), e += String.fromCharCode(63 & n | 128)) } return e }(r)).length, m = new Array; for (o = 0; o < b - 3; o += 4)a = r.charCodeAt(o) << 24 | r.charCodeAt(o + 1) << 16 | r.charCodeAt(o + 2) << 8 | r.charCodeAt(o + 3), m.push(a); switch (b % 4) { case 0: o = 2147483648; break; case 1: o = r.charCodeAt(b - 1) << 24 | 8388608; break; case 2: o = r.charCodeAt(b - 2) << 24 | r.charCodeAt(b - 1) << 16 | 32768; break; case 3: o = r.charCodeAt(b - 3) << 24 | r.charCodeAt(b - 2) << 16 | r.charCodeAt(b - 1) << 8 | 128 }for (m.push(o); m.length % 16 != 14;)m.push(0); for (m.push(b >>> 29), m.push(b << 3 & 4294967295), n = 0; n < m.length; n += 16) { for (o = 0; o < 16; o++)d[o] = m[n + o]; for (o = 16; o <= 79; o++)d[o] = e(d[o - 3] ^ d[o - 8] ^ d[o - 14] ^ d[o - 16], 1); for (h = g, c = s, f = A, C = l, u = S, o = 0; o <= 19; o++)i = e(h, 5) + (c & f | ~c & C) + u + d[o] + 1518500249 & 4294967295, u = C, C = f, f = e(c, 30), c = h, h = i; for (o = 20; o <= 39; o++)i = e(h, 5) + (c ^ f ^ C) + u + d[o] + 1859775393 & 4294967295, u = C, C = f, f = e(c, 30), c = h, h = i; for (o = 40; o <= 59; o++)i = e(h, 5) + (c & f | c & C | f & C) + u + d[o] + 2400959708 & 4294967295, u = C, C = f, f = e(c, 30), c = h, h = i; for (o = 60; o <= 79; o++)i = e(h, 5) + (c ^ f ^ C) + u + d[o] + 3395469782 & 4294967295, u = C, C = f, f = e(c, 30), c = h, h = i; g = g + h & 4294967295, s = s + c & 4294967295, A = A + f & 4294967295, l = l + C & 4294967295, S = S + u & 4294967295 } return (i = t(g) + t(s) + t(A) + t(l) + t(S)).toLowerCase()
}
function checkFlag(flag) {
    // const flag_enc = 'TSC{\x01PU[\x11\x05\x05\x04\x0FRk\x12UR\tn^PE\x04\x10<\x03RY\rX9\x03\x04\x10\x07=\x1A\x00D<@\x12n\f\x07}'
    flag_enc = "TSC{PU[RkUR\tn^PE<RY\rX9=\0D<@n\f}"
    if (flag.length !== 50) return false;
    if (flag.substring(0, 4) !== 'TSC{') return false;
    if (flag.substring(flag.length - 1) !== '}') return false;

    const key = SHA1(flag.substring(0, 7))
    for (let i = 7; i < flag.length - 1; i++) {
        if ((flag_enc.charCodeAt(i - 3) ^ flag.charCodeAt(i)) === key.charCodeAt((i) % key.length)^1) return false;
    }
    if ('8d41c13d201aa912146145ceff9589ed194c97a7' !== SHA1(flag)) return false;
    return true;
}

printable = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&\'()*+,-./:;<=>?@[\\]^_`|~ '

flag_enc = "TSC{PU[RkUR\tn^PE<RY\rX9=\0D<@n\f}"
flag_prefix = "TSC{"

for (const i of printable) {
    for (const j of printable) {
        for (const k of printable) {
            let e = flag_prefix + i + j + k
            let r = e;
            e = SHA1(e)
            let isValid = true
            for (let t = 7; t < 49; t++) {
                const s = String.fromCharCode(flag_enc.charCodeAt(t - 3) ^ e.charCodeAt(t % e.length))
                if (!printable.includes(s)) {
                    isValid = false
                    break
                }
                r += s
            }
            r += '}'
            if (isValid && checkFlag(r))
                console.log(r)
        }
    }
}