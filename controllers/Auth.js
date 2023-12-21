const Auth = require('../models/Auth')

const login = async (req, res) => {
  const { name, phoneNumber,password } = req.body
  if (!name || !phoneNumber || !password) {
    res.status(401).json({message:'Please provide valid credentials'})
  }

  console.log(req.isAuthenticated())

  try {
    const user = await Auth.findOne({ phoneNumber })
    if (!user) {
      return res.status(401).send({ message: 'User not registered' })
    }

    const token = user.createJWT()
    req.isAuth = true

    res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
    res.status(201).json({user:{name:user.name,phoneNumber:user.phoneNumber},message:'Check cookies for token'})
  } catch (error) {
    console.error(error)
    req.isAuth = true
    res.send(error)
  }
}

const register = async (req, res) => {
  const { name, phoneNumber,password } = req.body
  try {
    if (!name || !phoneNumber || !password) {
      res.status(400).json({message:'Please provide all credentials'})
    }
    const user = await Auth.create(req.body)

    const token = user.createJWT()
    req.isAuth = true

    res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
    res.status(201).json({user:{name:user.name,phoneNumber:user.phoneNumber},message:'Check cookies for token'})
  } catch (error) {
    console.error(error)
    req.isAuth = false
    res.send(error)
  }
}

const logout = (req, res,next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    // res.redirect('localhost:3000/api/v1/auth/login');
    res.clearCookie('token');
    res.status(200).send('logout successfully')
  });
}

module.exports = {
  login,
  register,
  logout
}