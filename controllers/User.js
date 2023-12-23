const {StatusCodes} = require('http-status-codes')

const getUser = (req, res) => {
  res.status(StatusCodes.OK).json({user:req.user,message:"Profile fetched successfully"})
}

module.exports = {
  getUser
}