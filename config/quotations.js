const moment = require('moment')

module.exports = {
  restart: true,
  secondsToWait: 20,
  initialDate: moment('2019-05-01').toDate(),
  finalDate: moment('2019-05-10').toDate(),
  initialDays: 19,
  finalDays: 20
}
