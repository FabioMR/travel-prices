const moment = require('moment')

module.exports = {
  restart: false,
  secondsToWait: 20,
  initialDate: moment('2019-06-01').toDate(),
  finalDate: moment('2019-08-15').toDate(),
  initialDays: 15,
  finalDays: 30
}
