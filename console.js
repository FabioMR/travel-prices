const repl = require('repl')
const puppeteer = require('puppeteer')

const instance = repl.start()

puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] }).then(browser => browser.newPage()).then(page => {
  instance.context.browserPage = page
})
