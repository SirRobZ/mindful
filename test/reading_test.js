require('chai').should();
const User = require('../server/models/user');
const Reflection = require('../server/models/reflection');

describe('Reading records', () => {
  let user1;
  let user2;
  let reflection1;
  let reflection2;
  let reflection3;
  let reflection4;

  beforeEach((done) => {
    reflection1 = new Reflection({ content: 'I am happy' });
    reflection2 = new Reflection({ content: 'I am mad' });
    reflection3 = new Reflection({ content: 'I am sad' });
    reflection4 = new Reflection({ content: 'I am fine' });
    user1 = new User({
      username: 'User1',
      reflections: [reflection1, reflection2]
    });
    user2 = new User({
      username: 'User2',
      reflections: [reflection3, reflection4]
    });

    Promise.all([
      user1.save(),
      user2.save(),
      reflection1.save(),
      reflection2.save(),
      reflection3.save(),
      reflection4.save()
    ])
      .then(() => done())
      .catch(err => done(err));
  });

  it('finds all users by the name of `User1`', (done) => {
    User.find({ username: 'User1' })
      .then((users) => {
        users[0]._id.toString().should.equal(user1._id.toString());
        done();
      })
      .catch(err => done(err));
  });

  it('find user with a particular id', (done) => {
    User.findById(user1._id)
      .then((user) => {
        user.username.should.equal('User1');
        done();
      })
      .catch(err => done(err));
  });

  it('finds all reflections of User1', (done) => {
    User.findById(user1._id).populate('reflections')
      .then(user => {
        user.reflections[0].content.should.equal('I am happy');
        user.reflections[1].content.should.equal('I am mad');
        done();
      })
      .catch(err => done(err));
  });

  it('finds user associated with reflection3', (done) => {
    User.findOne({
      reflections: {
        $in: [reflection3._id]
      }
    })
      .then(user => {
        user.username.should.equal('User2');
        done();
      })
      .catch(err => done(err));
  });
});
