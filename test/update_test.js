require('chai').should()
const User = require('../server/models/user')

describe('Updating records', () => {
  let abc

  beforeEach((done) => {
    abc = new User({ username: 'ABC' })
    abc.save()
      .then(() => {
        done()
      })
      .catch(err => done(err))
  })

  function assertName(operation, done) {
    operation.then(() => User.find({})).then(users => {
      users.length.should.equal(1)
      users[0].username.should.equal('DEF')
      done()
    })
  }

  it('model instance set n save', (done) => {
    abc.set('username', 'DEF')
    assertName(abc.save(), done)
  })

  it('model instnace update', (done) => {
    abc.update({ username: 'DEF' })
    assertName(abc.update({ username: 'DEF' }), done)
  })

  it('model class update', (done) => {
    assertName(User.update({
      username: 'ABC'
    }, { username: 'DEF' }), done)
  })

  it('model class findAndUpdate', (done) => {
    assertName(User.findOneAndUpdate({
      username: 'ABC'
    }, { username: 'DEF' }), done)
  })

  it('model class findByIdAndUpdate', (done) => {
    assertName(User.findByIdAndUpdate(abc._id, { username: 'DEF' }), done)
  })
})
