const Dept = require('../models/Deptor')
const { StatusCodes } = require('http-status-codes')

const getAllDepts = async (req, res) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page-1) * limit
  try {
    const dept = await Dept.find({}).sort('createdAt').skip(skip).limit(limit)
    res.status(StatusCodes.OK).json({message:'Dept fetched successfully',dept,nbHits:dept.length})
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'An error occured please try again later',error})
  }
}

const createDept = async (req, res) => {
  req.body.createdBy = req.user._id
  try {
    const dept = await Dept.create(req.body)
    res.status(201).json({message:'Dept successfully created',dept})
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'An error occured please try again later',error})
  }
}

const getDept = async (req, res) => {
  try {
    const dept = await Dept.findById({ _id: req.params.id })
    if (!dept) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Dept not found' });
    }
    res.status(StatusCodes.OK).json({message:'Dept fetched successfully',dept})
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'An error occured please try again later',error})
  }
}

const updateDept = async (req, res) => {
  const { params: { id }, user: { _id: userId }, body } = req
  try {
    const dept = await Dept.findOneAndUpdate(
      {
        _id: id, createdBy: userId
      },
      body,
      { new: true, runValidators: true }
    )
    if (!dept) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Dept not found' });
    }
    res.status(StatusCodes.OK).json({message:'Dept updated successfully',dept})
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'An error occured please try again later',error})
  }
}

const deleteDept = async (req, res) => {
  try {
    const dept = await Dept.findOneAndDelete({ _id: req.params.id })
    if (!dept) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Dept not found' });
    }
    res.status(StatusCodes.OK).json({message:'Dept deleted successfully'})
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'An error occured please try again later',error})
  }
}

module.exports = {
  getAllDepts,
  getDept,
  createDept,
  updateDept,
  deleteDept
}