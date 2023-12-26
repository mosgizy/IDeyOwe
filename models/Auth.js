const mongoose = require('mongoose')
const jsonToken = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const AuthSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  phoneNumber: {
    type: String,
    // required: [true, 'Please provide a phone number'],
    match: [/^[0-9]{11}$/,'Please provide a valid phone number'],
    unique: true,
    sparse: true, 
    trim: true
  },
  password: {
    type: String,
    // required: [true, 'Please provide password'],
    minlength:6
  },
  email: {
    type: String,
    required:false,
    // required: [true, "Please provide an email address"],
    minlength: 6,
    maxlegth: 50,
    match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email'],
    unique: true,
    sparse: true, // Allows null values to be stored as unique
    lowercase: true,
    trim: true
  },
  authType: {
    type: String,
    default:'manual'
  }
},{timestamps:true})

AuthSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

AuthSchema.methods.createJWT = function () {
  return jsonToken.sign({
    userId: this._id,
    name: this.name
  },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME
    }
  )
}

AuthSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password)
  return isMatch
}

module.exports = mongoose.model('User',AuthSchema)