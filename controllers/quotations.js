const firestore = require('../services/firestore')

const index = async (req, res) => {
  const snapshot = await firestore.collection('quotations').orderBy('value').limit(50).get()
  const data = await Promise.all(snapshot.docs.map(doc => doc.data()))

  res.send(data)
}

module.exports = {
  index
}
