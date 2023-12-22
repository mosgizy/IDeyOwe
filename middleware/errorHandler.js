const { StatusCodes } = require('http-status-codes')

const errorHandler = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong, try again later'
  }

  if (err.name === 'ValidationError') {
    customError.statusCode = StatusCodes.BAD_REQUEST
    customError.message = Object.values(err.errors).map(item => item.message).join(', ')
  }

  if (err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST
    customError.message = "User already exist, please login"
  }

  if (err.name === 'CastError') {
    customError.statusCode = StatusCodes.NOT_FOUND
    customError.message = `Resource not found - ${err.value}`
  }

  return res.status(customError.statusCode).json({message:customError.message})
}

module.exports = errorHandler