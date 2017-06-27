const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const DATABASE_URL_TEST = process.env.DATABASE_URL_TEST

before((done) => {
  mongoose.connect(DATABASE_URL_TEST || 'mongodb://localhost/mindful_test')
  mongoose.connection
    .once('open', () => { done() })
    .on('error', (error) => {
      /* eslint-disable no-console */
      console.warn('Warning', error)
    })
})

beforeEach((done) => {
  const { collections } = mongoose.connection
  const collectionKeys = Object.keys(collections)
  let counter = 0

  function check() {
    counter += 1
    if (counter === collectionKeys.length) {
      done()
    }
  }

  collectionKeys.forEach((collection) => {
    mongoose.connection.db.dropCollection(collection, () => { check() })
  })
})
