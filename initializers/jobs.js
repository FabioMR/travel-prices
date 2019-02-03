const Arena = require('bull-arena')
const puppeteer = require('puppeteer')
const jobs = require('../services/jobs')
const jobsConfig = require('../config/jobs')
const quotationsConfig = require('../config/quotations')

const basePath = '/jobs/'

const arena = Arena({
  queues: jobsConfig.queuesName.map(name => ({
    hostId: 'app',
    name: name,
    type: 'bee',
    redis: { url: process.env.REDIS_URL }
  }))
}, {
  basePath,
  disableListen: true
})

module.exports = async app => {
  app.use('/', arena)

  if (quotationsConfig.restart) await jobs.removeAll()

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  global.browserPage = await browser.newPage()

  jobsConfig.queuesName.forEach(name => {
    require(`../services/jobs/process/${name}`)()
  })
}
