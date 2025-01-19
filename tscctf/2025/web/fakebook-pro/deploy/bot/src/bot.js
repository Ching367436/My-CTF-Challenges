const puppeteer = require("puppeteer")
const crypto = require("crypto")

const FLAG = process.env.FLAG || 'TSC{test flag}'
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin_username'
const ADMIN_PASSWORD = FLAG
const SITE = process.env.SITE || 'http://cms:80'

console.log(`[+] FLAG: ${FLAG}`)
console.log(`[+] ADMIN_USERNAME: ${ADMIN_USERNAME}`)
console.log(`[+] ADMIN_PASSWORD: ${ADMIN_PASSWORD}`)
console.log(`[+] SITE: ${SITE}`)

const sleep = async s => new Promise(resolve => setTimeout(resolve, 1000 * s))

const visit = async url => {
	let browser
	try {
		url = new URL(url)
		browser = await puppeteer.launch({
			headless: true,
			args: ["--disable-gpu", "--no-sandbox"],
			executablePath: "/usr/bin/chromium-browser",
		});
		const context = await browser.createIncognitoBrowserContext()
		const page = await context.newPage()

		// set cookie
		await page.setCookie({
			name: "flag",
			value: btoa(eval(`${'F'+'L'+'A'+'G'}`)),
			domain: url.hostname,
		})

		await page.setCookie({
			name: "admin",
			value: "true",
			domain: url.hostname,
		})

		await page.goto(SITE)
		await sleep(2)
		await page.type("#username", ADMIN_USERNAME + crypto.randomBytes(8).toString('hex'))
		await page.type("#password", ADMIN_PASSWORD)
		await page.click("#login");
		await sleep(2);
		await page.goto(url, { timeout: 10000 });
		await sleep(10);

		await browser.close()
	} catch (e) {
		console.log(e)
	} finally {
		if (browser) await browser.close()
	}
}

module.exports = visit

if (require.main === module) {
	visit(SITE)
}