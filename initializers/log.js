require('express-async-errors')
const logger = require('../services/logger')

module.exports = async () => {
  const handleError = err => {
    logger.error(err)
    process.exit(1)
  }

  process.on('uncaughtException', handleError)
  process.on('unhandledRejection', handleError)
}
