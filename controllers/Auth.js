const Auth = require('../models/Auth')
const { StatusCodes } = require('http-status-codes')

const login = async (req, res) => {
  const { phoneNumber,password } = req.body
  if (!phoneNumber || !password) {
    res.status(StatusCodes.UNAUTHORIZED).json({message:'Please provide valid credentials'})
  }

  const user = await Auth.findOne({ phoneNumber })
  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'User not registered' })
  }

  const isPassword = await user.comparePassword(password)

  if (!isPassword) {
    return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Invalid phone number or password ' })
  }

  const token = user.createJWT()

  res.cookie('token', token, { maxAge: 3600000, httpOnly: true,sameSite: 'None', secure: true });
  res.status(StatusCodes.OK).json({user:{name:user.name,phoneNumber:user.phoneNumber},message:'Check cookies for token'})
  
}

const register = async (req, res) => {
  const { name, phoneNumber, password } = req.body
  
  if (!name || !phoneNumber || !password) {
    res.status(StatusCodes.UNAUTHORIZED).json({message:'Please provide all credentials'})
  }
  const user = await Auth.create(req.body)

  const token = user.createJWT()

  res.cookie('token', token, { maxAge: 3600000, httpOnly: true,sameSite: 'None', secure: true });
  res.status(StatusCodes.CREATED).json({user:{name:user.name,phoneNumber:user.phoneNumber},message:'Check cookies for token'})
}

const logout = (req, res, next) => {
  res.clearCookie('token');
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    const cookies = req.cookies;
    for (const cookieName in cookies) {
      res.clearCookie(cookieName);
    }

    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return next(err);
      }      

      res.status(StatusCodes.OK).json({ message: 'Logout successful' });
    });
  });
};

module.exports = {
  login,
  register,
  logout
}