module.exports = async app => {
  await require('./cors')(app)
  await require('./log')()
  await require('./jobs')(app)
  await require('./routes')(app)
  await require('./quotations')()
}
