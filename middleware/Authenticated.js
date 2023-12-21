const jsonToken = require('jsonwebtoken')
const AuthUser = require('../models/Auth')
const { StatusCodes } = require('http-status-codes')

const checkAuthenticated = async (req, res, next) => {
  const token = req.cookies.token
  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({message:'Token not found'})
  }
  
  try {
    const payload = jsonToken.verify(token, process.env.JWT_SECRET)
    const user = await AuthUser.findOne({ _id: payload.userId }).select('-password')
    req.user = user
    if (user) {
      return next()
    }
    res.status(StatusCodes.NOT_FOUND).json({message:'User cannot be found'})
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({message:'Unauthorized to access'})
  }

  // if (req.isAuthenticated()) {
  // }

  // res.redirect('localhost:3000/api/v1/auth/login');
}

module.exports = checkAuthenticated