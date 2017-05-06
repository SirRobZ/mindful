/* eslint-disable consistent-return*/

const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const app = require('../../server')
const User = require('../../server/models/user')
chai.should()
chai.use(chaiHttp)

describe('The users controller', () => {
  let joe
  let bob

  beforeEach((done) => {
    joe = new User({
      username: 'Joe',
      email: 'Joe@test.com'
    })
    bob = new User({
      username: 'Bob',
      email: 'Bob@test.com'
    })
    Promise.all([joe.save(), bob.save()])
      .then(() => done())
      .catch(error => done(error))
  })

  it('handles a GET request to /api/users', (done) => {
    chai.request(app)
      .get('/api/users')
      .end((err, res) => {
        if (err) { return done(err) }
        res.body.length.should.equal(2)
        return done()
      })
  })

  it('handles a GET request to /api/users/:id', (done) => {
    chai.request(app)
      .get(`/api/users/${joe._id}`)
      .end((err, res) => {
        if (err) { return done(err) }
        res.body.email.should.equal('Joe@test.com')
        res.body._id.should.equal(joe._id.toString())
        return done()
      })
  })

  it('handles a POST request to /api/users', (done) => {
    User.count().then(count => {
      chai.request(app)
        .post('/api/users')
        .send({ username: 'Joe' })
        .end((err) => {
          if (err) { return done(err) }
          User.count()
            .then(newCount => {
              newCount.should.equal(count + 1)
              done()
            })
            .catch(error => done(error))
        })
    })
    .catch(error => done(error))
  })

  xit('Prevent duplicate username or email', (done) => {
  })

  it('handles a PUT request to /api/users/:id', (done) => {
    chai.request(app)
      .put(`/api/users/${joe._id}`)
      .send({ email: 'JoeNew@test.com' })
      .end((err) => {
        if (err) { return done(err) }
        User.findById(joe._id)
          .then(updatedUser => {
            updatedUser.email.should.equal('JoeNew@test.com')
            done()
          })
          .catch(error => done(error))
      })
  })
  it('handles a DELETE request to /api/users/:id', (done) => {
    chai.request(app)
      .delete(`/api/users/${joe._id}`)
      .end((err) => {
        if (err) { return done(err) }

        User.findById(joe._id)
          .then(deletedUser => {
            /* eslint-disable no-unused-expressions*/
            expect(deletedUser).to.be.null
            done()
          })
          .catch(error => done(error))
      })
  })
})
