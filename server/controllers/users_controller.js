const User = require('../models/user')

module.exports = {
  getAll(req, res, next) {
    User.find({})
      .then(users => res.json(users.map(user => user.apiRepr())))
      .catch(next)
  },
  getOne(req, res, next) {
    const userId = req.params.id
    User.findById(userId)
      .then(user => {
        res.json(user.apiRepr())
      })
      .catch(next)
  },
  create(req, res, next) {
    const userProps = req.body;
    console.log('>> userProps: ', userProps);
    // verify correct keys being passed
    const user = new User(userProps)

    console.log('>> user: ' );

    user.save()
      .then((savedUser) => {
        User.findById(savedUser._id)
          .then(() => {
            res.status(201).send(user.apiRepr())
          })
          .catch(next)
      })
      .catch(next);
  },
  edit(req, res, next) {
    const userId = req.params.id
    const userProps = req.body
    // verify correct keys are being passed
    User.findByIdAndUpdate(userId, userProps)
      .then(() => User.findById(userId))
      .then(user => res.send(user.apiRepr()))
      .catch(next)
  },
  delete(req, res, next) {
    const userId = req.params.id
    User.findByIdAndRemove(userId)
      .then(user => res.status(204).send(user.apiRepr()))
      .catch(next)
  }
}
