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
      .then(([joeUser, bobUser]) => {
        console.log('>>>> joeUser:', joeUser);
        console.log('>>>> bobUser:', bobUser);
        done();
      })
      .catch(error => {
        console.log('ERROR IN USER CREATION!!');
        done(error);
      });
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
        console.log(err)
        if (err) { return done(err) }
        res.body.email.should.equal('Joe@test.com')
        res.body.id.should.equal(joe._id.toString())
        return done()
      })
  })

  it('handles a POST request to /api/users', (done) => {
    User.count().then(count => {
      chai.request(app)
        .post('/api/users')
        .send({ username: 'Joe2', email: 'Joe2@test.com' })
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

  it('Prevent duplicate username', (done) => {
    chai.request(app)
      .post('/api/users')
      .send({ username: 'Bob', email: 'bobby@mail.com', firstName: 'Bobby2', lastName: 'Bob' })
      .end((err, res) => {
        res.status.should.equal(409);
        return done();
      });
  });

  it('Prevent duplicate email', (done) => {
    chai.request(app)
      .post('/api/users')
      .send({ username: 'Bobby', email: 'Bob@test.com' })
      .end((err, res) => {
        res.status.should.equal(409);
        return done();
      });
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
