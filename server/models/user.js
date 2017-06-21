const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const UserSchema = new Schema({
  username: {
    type: String,
    //unique: true,
    validate: {
      validator: (username) => username.length > 2,
      message: 'Name must be longer than 2 characters.'
    },
    required: [true, 'Name is required.']
  },
  firstName: String,
  lastName: String,
  email: {
    type: String,
    //unique: true,
  },
  password: String,
  mindfulnessScore: Number,
  reflections: [
    {
      type: ObjectId,
      ref: 'reflection'
    }
  ]
})

UserSchema.methods.apiRepr = function () {
  return {
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    mindfulnessScore: this.mindfulnessScore,
    reflections: this.reflections,
    id: this._id
  }
}

UserSchema.virtual('reflectionCount').get(function virtual() {
  return this.reflections.length
})

UserSchema.pre('save', function pre(next) {
  const User = mongoose.model('user')
  User.findOne({ username: this.username })
    .then(user => {
      if (user === null) {
        return next()
      }
      const err = new Error('username must be unique')
      return next(err)
    })
})

// UserSchema.pre('save', function pre(next) {
//   const User = mongoose.model('user')
//   User.findOne({ email: this.email })
//     .then(user => {
//       if (user === null) {
//         return next()
//       }
//       const err = new Error('email must be unique')
//       return next(err)
//     })
// })

UserSchema.pre('remove', function pre(next) {
  const Reflection = mongoose.model('reflection')
  Reflection.remove({
    _id: {
      $in: this.reflections
    }
  }).then(() => next())
})

const User = mongoose.model('user', UserSchema)

module.exports = User
