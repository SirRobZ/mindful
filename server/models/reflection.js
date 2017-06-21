const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const HabitSchema = new Schema({
  sleep: Boolean,
  exercise: Boolean,
  diet: Boolean,
  meditation: Boolean,
  reflection: {
    type: ObjectId,
    ref: 'reflection'
  }
})

const ReflectionSchema = new Schema({
  content: String,
  mindfulnessScore: Number,
  createdAt: Date,
  updatedAt: Date,
  habit: HabitSchema
})

ReflectionSchema.virtual('reflectionScore').get(function virtual() {
  return this.contentSentiment * 0.75
})

const Reflection = mongoose.model('reflection', ReflectionSchema)

module.exports = Reflection
