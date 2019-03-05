const createProcess = require('../createProcess')
const cheerio = require('cheerio')
const moment = require('moment')
const logger = require('../../../services/logger')
const firestore = require('../../../services/firestore')
const config = require('../../../config/quotations')

const wait = () => new Promise((resolve, reject) => setTimeout(resolve, config.secondsToWait * 1000))

module.exports = () => createProcess('booking', async job => {
  const resource = 'booking'
  const startsOn = job.data.startsOn
  const days = job.data.days
  const endsOn = moment(startsOn).add(days, 'days').toDate()
  const url = `https://www.booking.com/searchresults.pt-br.html?label=gen173nr-1DCAEoggI46AdIM1gEaCCIAQGYAS24AQfIAQzYAQPoAQGIAgGoAgO4Aprw_-MFwAIB&sid=6f987eaa8e17d59d7bf5ef993d858ca4&sb=1&src=index&src_elem=sb&error_url=https%3A%2F%2Fwww.booking.com%2Findex.pt-br.html%3Flabel%3Dgen173nr-1DCAEoggI46AdIM1gEaCCIAQGYAS24AQfIAQzYAQPoAQGIAgGoAgO4Aprw_-MFwAIB%3Bsid%3D6f987eaa8e17d59d7bf5ef993d858ca4%3Bsb_price_type%3Dtotal%26%3B&ss=Vila+Gal%C3%A9+Eco+Resort+Angra+-+All+Inclusive%2C+Angra+dos+Reis%2C+Estado+do+Rio+de+Janeiro%2C+Brasil&is_ski_area=&ssne=Angra+dos+Reis&ssne_untouched=Angra+dos+Reis&checkin_year=${moment(startsOn).year()}&checkin_month=${moment(startsOn).month() + 1}&checkin_monthday=${moment(startsOn).date()}&checkout_year=${moment(endsOn).year()}&checkout_month=${moment(endsOn).month() + 1}&checkout_monthday=${moment(endsOn).date()}&group_adults=2&group_children=2&no_rooms=1&age=3&age=7&b_h4u_keep_filters=&from_sf=1&ss_raw=angra&ac_position=1&ac_langcode=xb&ac_click_type=b&dest_id=189219&dest_type=hotel&place_id_lat=-23.006821314798&place_id_lon=-44.3526327610016&search_pageview_id=8904754da01100da&search_selected=true&search_pageview_id=8904754da01100da&ac_suggestion_list_length=5&ac_suggestion_theme_list_length=0`

  await global.browserPageBooking.goto(url)
  await wait()
  const html = await global.browserPageBooking.content()
  const $ = cheerio.load(html)
  let value = parseInt($('.sr_item').first().find('.totalPrice').text().split('\n')[3].replace('R$', '').trim().replace('.', '')) || null

  if (value) {
    value = Math.round(value / days)
    logger.info(value)
  } else {
    logger.error({ stack: url })
    throw new Error('Value not found.')
  }

  const collection = firestore.collection('quotations')
  const query = await collection
    .where('resource', '==', 'booking')
    .where('startsOn', '==', startsOn)
    .where('days', '==', days)
    .get()

  if (query.empty) {
    await collection.add({ resource, startsOn, days, value, url })
  } else {
    collection.doc(query.docs[0].id).update({ value })
  }
})
