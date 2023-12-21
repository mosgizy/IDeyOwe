const mongoose = require('mongoose')

const DeptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide title of dept'],
    trim: true
  },
  description: {
    type: String,
    trim:true
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required:[true,'Please provide user']
  }
},{timestamps:true})

module.exports = mongoose.model('dept',DeptSchema)