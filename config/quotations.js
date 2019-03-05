const moment = require('moment')

module.exports = {
  restart: true,
  secondsToWait: 10,
  initialDate: moment('2019-10-15').toDate(),
  finalDate: moment('2019-11-15').toDate(),
  initialDays: 6,
  finalDays: 6
}
