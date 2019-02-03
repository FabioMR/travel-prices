const express = require('express')
const routes = require('../routes')
const logger = require('../services/logger')

module.exports = async app => {
  app.use(express.json())

  routes(app)

  app.use((req, res, next) => {
    res.status(404).send({ error: 'Caminho não encontrado.' })
  })

  app.use((err, req, res, next) => {
    logger.error(err, { req })
    res.status(500).send({ error: 'Erro inesperado, tente novamente.' })
  })
}
