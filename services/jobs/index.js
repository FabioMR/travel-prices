const queues = require('./queues')

module.exports = {
  removeAll: async () => {
    await queues.hotelurbano.destroy()
    await queues.booking.destroy()
  },
  empty: async () => {
    const hotelurbano = await queues.hotelurbano.checkHealth()
    const booking = await queues.booking.checkHealth()

    return !hotelurbano.active && !hotelurbano.delayed && !hotelurbano.waiting && !booking.active && !booking.delayed && !booking.waiting
  },
  hotelurbano: async (params) => queues.hotelurbano.createJob(params).save(),
  booking: async (params) => queues.booking.createJob(params).save()
}
