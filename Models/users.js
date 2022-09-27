const mongoose = require('mongoose')
const Yup = require('yup')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const schema = Yup.object().shape({
  fullname: Yup.string()
    .required('Provide  Fullname')
    .min(4, 'Less than 4 character')
    .max(255),
  email: Yup.string()
    .email('Provide a unique email')
    .required('Provide an emial'),
  password: Yup.string()
    .required('Provide password')
    .min(4, 'Less than 4 character')
    .max(255),
  confirmPassword: Yup.string()
    .required('Provide password')
    .oneOf([Yup.ref('password'), null])
})

userSchema.statics.userValidation = function (body) {
  return schema.validate(body, { abortEarly: false })
}

userSchema.pre('save', function (next) {
  let user = this

  if (!user.isModified('password')) return next()

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err)

    user.password = hash
    next()
  })
})

const User = mongoose.model('User', userSchema)

module.exports = User
