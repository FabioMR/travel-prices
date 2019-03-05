const createProcess = require('../createProcess')
const cheerio = require('cheerio')
const moment = require('moment')
const logger = require('../../../services/logger')
const firestore = require('../../../services/firestore')
const config = require('../../../config/quotations')

const wait = () => new Promise((resolve, reject) => setTimeout(resolve, config.secondsToWait * 1000))

module.exports = () => createProcess('hotelurbano', async job => {
  const resource = 'hotelurbano'
  const startsOn = job.data.startsOn
  const days = job.data.days
  const endsOn = moment(startsOn).add(days, 'days').toDate()
  const url = `https://www.hotelurbano.com/hoteis/angra-dos-reis/vila-gale-eco-resort-de-angra-conference-e-spa-OMN-2181/${moment(startsOn).format('DD-MM-YYYY')}/${moment(endsOn).format('DD-MM-YYYY')}/1/2/2/3,7`

  await global.browserPageHotelUrbano.goto(url)
  await wait()
  const html = await global.browserPageHotelUrbano.content()
  const $ = cheerio.load(html)
  let value = parseInt($('.feature-price-min-value .promotion-price').text()) || null

  if (value) {
    value = Math.round(value)
    logger.info(value)
  } else {
    logger.error({ stack: url })
    throw new Error('Value not found.')
  }

  const collection = firestore.collection('quotations')
  const query = await collection
    .where('resource', '==', 'hotelurbano')
    .where('startsOn', '==', startsOn)
    .where('days', '==', days)
    .get()

  if (query.empty) {
    await collection.add({ resource, startsOn, days, value, url })
  } else {
    collection.doc(query.docs[0].id).update({ value })
  }
})
