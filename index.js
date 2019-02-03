const app = require('express')()
const initializers = require('./initializers')
const logger = require('./services/logger')

initializers(app)

module.exports = app.listen(process.env.PORT, () =>
  logger.info(`Listening on port ${process.env.PORT}...`)
)
