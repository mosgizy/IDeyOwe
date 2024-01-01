const {StatusCodes} = require('http-status-codes')

const getUser = (req, res) => {
  res.status(StatusCodes.OK).json({user:req.user,message:"Profile fetched successfully"})
}

const isLoggedIn = async (req, res) => {
  res.status(StatusCodes.OK).json({message:'User logged in'})
}

module.exports = {
  getUser,
  isLoggedIn
}