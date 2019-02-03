const home = require('../controllers/home')
const quotations = require('../controllers/quotations')

module.exports = app => {
  app.get('/', home.index)
  app.get('/quotations', quotations.index)
}
