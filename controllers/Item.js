const Item = require('../models/ItemsBought')
const { StatusCodes } = require('http-status-codes')
const mongoose = require('mongoose');

const getAllItems = async (req, res) => {
  const { user: { _id: userId } } = req
  const dept = new mongoose.Types.ObjectId(req.baseUrl.split('/')[4])
  try {
    const items = await Item.find({ dept, createdBy: userId })
    res.status(StatusCodes.OK).json({message:'Item successfully fetched',items,nbHits:items.length})
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'An error occured please try again later',error})
  }
}

const createItem = async (req, res) => {
  const { user:{_id:userId} } = req
  req.body.createdBy = userId
  req.body.dept = new mongoose.Types.ObjectId(req.baseUrl.split('/')[4])
  try {
    const item = await Item.create(req.body)
    res.status(StatusCodes.CREATED).json({message:'Item successfully created',item})
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'An error occured please try again later',error})
  }
}

const getItem = async (req, res) => {
  const dept = new mongoose.Types.ObjectId(req.baseUrl.split('/')[4])
  try {
    const item = await Item.findOne({ _id: req.params.itemId,dept,createdBy:req.user._id })
    if (!item) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Dept not found' });
    }
    res.status(StatusCodes.OK).json({message:'Item successfully fetched',item})
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'An error occured please try again later',error})
  }
}

const updateItem = async (req, res) => {
  const { params: { itemId }, user: { _id: userId }, body } = req
  const dept = new mongoose.Types.ObjectId(req.baseUrl.split('/')[4])
  try {
    const item = await Item.findOneAndUpdate(
      {
        _id: itemId, createdBy: userId,dept
      },
      body,
      { new: true, runValidators: true }
    )
    if (!item) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Dept not found' });
    }
    res.status(StatusCodes.OK).json({message:'Item successfully updated',item})
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'An error occured please try again later',error})
  }
}

const deleteItem = async (req, res) => {
  const dept = new mongoose.Types.ObjectId(req.baseUrl.split('/')[4])
  try {
    const item = await Item.findOneAndDelete({ _id: req.params.itemId,createdBy:req.user._id,dept })
    if (!item) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Dept not found' });
    }
    res.status(StatusCodes.OK).json({message:'Item successfully deleted'})
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'An error occured please try again later',error})
  }
}

module.exports = {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem
}