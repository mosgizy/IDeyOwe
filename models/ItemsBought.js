const mongoose = require('mongoose')

const ItemBoughtSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Please provide item name'],
    trim:true
  },
  price: {
    type: Number,
    required:[true,'Please provide amount owe']
  },
  dept: {
    type: mongoose.Types.ObjectId,
    ref: 'dept'
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required:[true,'Please provide user']
  }
}, { timestamps: true })

module.exports = mongoose.model('Item',ItemBoughtSchema)