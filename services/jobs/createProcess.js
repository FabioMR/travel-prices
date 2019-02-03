const queues = require('./queues')
const config = require('../../config/jobs')

module.exports = (name, callback) => {
  queues[name].process(config.concurrency, callback)
}
