const Reflection = require('../models/reflection')
const User = require('../models/user')


module.exports = {
  getAll(req, res, next) {
    Reflection.find({})
      .then(reflections => res.json(reflections))
      .catch(next)
  },
  getOne(req, res, next) {
    const reflectionId = req.params.id
    Reflection.findById(reflectionId)
      .then(reflection => res.json(reflection))
      .catch(next)
  },
  create(req, res, next) {
    const props = req.body
    const userId = props.user
    // verify correct keys being passed
    const reflection = new Reflection(props);

    User.findById(userId)
      .then((user) => {
        if (user) {
          user.reflections.push(reflection._id);
          return Promise.all([User.findByIdAndUpdate(userId, user), reflection.save()])
        }
        return Promise.reject('User could not be found')
      })
      .then((models) => {
        res.status(201).json({ user: models[0], reflection: models[1] })
      })
      .catch(next)
  },
  edit(req, res, next) {
    const reflectionId = req.params.id
    const reflectionProps = req.body
    // verify correct keys are being passed
    Reflection.findByIdAndUpdate(reflectionId, reflectionProps)
      .then(() => Reflection.findById(reflectionId))
      .then(reflection => res.send(reflection))
      .catch(next)
  },
  delete(req, res, next) {
    const reflectionId = req.params.id
    Reflection.findByIdAndRemove(reflectionId)
      .then(reflection => res.status(204).send(reflection))
      .catch(next)
  }
}
