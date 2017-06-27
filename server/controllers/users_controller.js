const User = require('../models/user')

module.exports = {
  getAll(req, res, next) {
    User.find({}).then(users => res.json(users.map(user => user.apiRepr()))).catch(next)
  },
  getOne(req, res, next) {
    const userId = req.params.id
    User.findById(userId).then(user => {
      res.json(user.apiRepr())
    }).catch(next)
  },
  create(req, res, next) {
    const userProps = req.body;
    // verify correct keys being passed
    if (userProps.username === 'mehran') {
    //   User.find({username: 'mehran'}).then(userObject => {
    console.log('>>>> User: mehranhatami : ', userProps);
    //     //const user = new User(userProps)
    //     return User.create(userProps).then((savedUser) => {
    //       console.log('>>> savedUser._id: ', savedUser._id);
    //       return User.findById(savedUser._id).then(() => {
    //         res.status(201).send(user.apiRepr())
    //       }).catch(next);
    //     }).catch(next);
    //   });
    //   return;
    }
    //const user = new User(userProps)
    User.create(userProps).then((savedUser) => {
      return User.findById(savedUser._id).then((user) => {
        res.status(201).send(user.apiRepr())
      }).catch(next);
    }).catch(next);
  },
  edit(req, res, next) {
    const userId = req.params.id
    const userProps = req.body
    // verify correct keys are being passed
    User.findByIdAndUpdate(userId, userProps).then(() => User.findById(userId)).then(user => res.send(user.apiRepr())).catch(next)
  },
  delete(req, res, next) {
    const userId = req.params.id
    User.findByIdAndRemove(userId).then(user => res.status(204).send(user.apiRepr())).catch(next)
  }
}
