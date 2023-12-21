const Auth = require('../models/Auth')
const { StatusCodes } = require('http-status-codes')

const login = async (req, res) => {
  const { name, phoneNumber,password } = req.body
  if (!name || !phoneNumber || !password) {
    res.status(StatusCodes.UNAUTHORIZED).json({message:'Please provide valid credentials'})
  }

  try {
    const user = await Auth.findOne({ phoneNumber })
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'User not registered' })
    }

    const isPassword = await user.comparePassword(password)

    if (!isPassword) {
      return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Invalid phone number or password ' })
    }

    const token = user.createJWT()

    res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
    res.status(StatusCodes.OK).json({user:{name:user.name,phoneNumber:user.phoneNumber},message:'Check cookies for token'})
  } catch (error) {
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
}

const register = async (req, res) => {
  const { name, phoneNumber,password } = req.body
  try {
    if (!name || !phoneNumber || !password) {
      res.status(StatusCodes.UNAUTHORIZED).json({message:'Please provide all credentials'})
    }
    const user = await Auth.create(req.body)

    const token = user.createJWT()

    res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
    res.status(StatusCodes.CREATED).json({user:{name:user.name,phoneNumber:user.phoneNumber},message:'Check cookies for token'})
  } catch (error) {
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
}

const logout = (req, res,next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    // res.redirect('localhost:3000/api/v1/auth/login');
    res.clearCookie('token');
    res.status(StatusCodes.OK).send('logout successfully')
  });
}

module.exports = {
  login,
  register,
  logout
}