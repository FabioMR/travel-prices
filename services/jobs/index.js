const queues = require('./queues')

module.exports = {
  removeAll: () => queues.viajanet.destroy(),
  counts: () => queues.viajanet.checkHealth(),
  viajanet: (params) => queues.viajanet.createJob(params).backoff('fixed', 60000).retries(5).save()
}
