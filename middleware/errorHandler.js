const { StatusCodes } = require('http-status-codes')

const errorHandler = (err, req, res, next) => {
  let customError = {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message:'Something went wrong, try again later'
  }

  return res.status()
}

module.exports = errorHandler