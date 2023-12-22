const Dept = require('../models/Deptor')
const Item = require('../models/ItemsBought')
const { StatusCodes } = require('http-status-codes')

const getAllDepts = async (req, res) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit
  
  const dept = await Dept.find({createdBy:req.user._id}).sort('createdAt').skip(skip).limit(limit)
  res.status(StatusCodes.OK).json({message:'Store fetched successfully',dept,nbHits:dept.length})
}

const createDept = async (req, res) => {
  req.body.createdBy = req.user._id
  const dept = await Dept.create(req.body)
  res.status(StatusCodes.CREATED).json({message:'Store successfully created',dept})
}

const getDept = async (req, res) => {
  const dept = await Dept.findOne({ _id: req.params.id, createdBy: req.user._id })

  if (!dept) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Store not found' });
  }
  res.status(StatusCodes.OK).json({message:'Store fetched successfully',dept})
  
}

const updateDept = async (req, res) => {
  const { params: { id }, user: { _id: userId }, body } = req
  const dept = await Dept.findOneAndUpdate(
    {
      _id: id, createdBy: userId
    },
    body,
    { new: true, runValidators: true }
  )
  if (!dept) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Store not found' });
  }
  res.status(StatusCodes.OK).json({message:'Store updated successfully',dept})
}

const deleteDept = async (req, res) => {
  const dept = await Dept.findOneAndDelete({ _id: req.params.id,createdBy:req.user._id })
  await Item.deleteMany({dept:req.params.id})
  if (!dept) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Store not found' });
  }
  res.status(StatusCodes.OK).json({message:'Store deleted successfully'})
}

module.exports = {
  getAllDepts,
  getDept,
  createDept,
  updateDept,
  deleteDept
}