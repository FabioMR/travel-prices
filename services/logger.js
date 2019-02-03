const winston = require('winston')

const logger = winston.createLogger()

logger.add(new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  )
}))

if (process.env.NODE_ENV !== 'development') {
  logger.add(new winston.transports.File({
    filename: `logs/${process.env.NODE_ENV}.log`,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  }))
}

module.exports = {
  info (message) {
    logger.log('info', message)
  },
  error (err) {
    logger.log('error', err.stack)
  }
}
