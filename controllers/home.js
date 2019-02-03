
const index = async (req, res) => {
  res.send({
    title: 'Travel Prices',
    env: process.env.NODE_ENV,
    config: {
      jobs: require('../config/jobs'),
      quotations: require('../config/quotations')
    }
  })
}

module.exports = {
  index
}
