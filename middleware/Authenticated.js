const jsonToken = require('jsonwebtoken')
const AuthUser = require('../models/Auth')
const { StatusCodes } = require('http-status-codes')

const checkAuthenticated = async (req, res, next) => {
  const token = req.cookies.token
  
  try {
    if (!token) {
      res.status(StatusCodes.UNAUTHORIZED).json({message:'Please login'})
    }
    const payload = jsonToken.verify(token, process.env.JWT_SECRET)

    if (!payload || !payload.userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' });
    }

    const user = await AuthUser.findOne({ _id: payload.userId }).select('-password')
    
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({message:'User cannot be found'})
    }
    
    req.user = user

    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token has expired' });
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
  }
}

module.exports = checkAuthenticated