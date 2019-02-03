const createProcess = require('../createProcess')
const cheerio = require('cheerio')
const moment = require('moment')
const logger = require('../../../services/logger')
const firestore = require('../../../services/firestore')
const config = require('../../../config/quotations')

const wait = () => new Promise((resolve, reject) => setTimeout(resolve, config.secondsToWait * 1000))

module.exports = () => createProcess('viajanet', async job => {
  const resource = 'viajanet'
  const startsOn = job.data.startsOn
  const days = job.data.days
  const endsOn = moment(startsOn).add(days, 'days').toDate()
  const url = `https://www.viajanet.com.br/busca/passagens/voos#/SAO/YEA/RT/${moment(startsOn).format('DD-MM-YYYY')}/${moment(endsOn).format('DD-MM-YYYY')}/-/-/-/2/2/0/-/-/-/-`

  await global.browserPage.goto(url)
  await wait()
  const html = await global.browserPage.content()
  const $ = cheerio.load(html)
  const value = parseInt($('.result_flow').first().find('.allprice-highlighted .price').text().replace('R$ ', '').replace('.', '')) || null

  if (!value) {
    logger.error({ stack: url })
    throw new Error('Value not found.')
  }

  const collection = firestore.collection('quotations')
  const query = await collection
    .where('resource', '==', 'viajanet')
    .where('startsOn', '==', startsOn)
    .where('days', '==', days)
    .get()

  if (query.empty) {
    await collection.add({ resource, startsOn, days, value, url })
  } else {
    collection.doc(query.docs[0].id).update({ value })
  }
})
