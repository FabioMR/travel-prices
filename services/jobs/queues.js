const Queue = require('bee-queue')
const config = require('../../config/jobs')
const logger = require('../../services/logger')

const queues = {}

config.queuesName.forEach(name => {
  queues[name] = new Queue(name, {
    activateDelayedJobs: true,
    redis: { url: process.env.REDIS_URL }
  })

  queues[name].on('failed', (job, err) => {
    logger.error(err)
  })
})

module.exports = queues
