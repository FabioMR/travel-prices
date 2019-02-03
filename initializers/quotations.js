const config = require('../config/quotations')
const jobs = require('../services/jobs')
const moment = require('moment')
const _ = require('lodash')

module.exports = async () => {
  const counts = await jobs.counts()

  if (!counts.active && !counts.delayed) {
    const initialDate = moment(config.initialDate)
    const finalDate = moment(config.finalDate)
    const interval = finalDate.diff(initialDate, 'days') + 1

    _(interval).times(async daysToAdd => {
      const startsOn = initialDate.clone().add(daysToAdd, 'days').toDate()
      _.range(config.initialDays, config.finalDays + 1).forEach(async days => {
        jobs.viajanet({ startsOn, days })
      })
    })
  }
}
