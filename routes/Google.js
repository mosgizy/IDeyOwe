const express = require('express')
const router = express.Router()
const passport = require('passport')
const Auth = require('../models/Auth')

router.route('/').get(passport.authenticate('google', { scope: ['profile', 'email'] }));

router.route('/callback').get(passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    const { user } = req

    let userAuth = await Auth.findOne({ email: user.email })
    
    if (!userAuth) {
      userAuth = await Auth.create({
        name: user.displayName,
        email: user.email,
        authType: user.provider,
        password:user.id
      })
    }

    const token = userAuth.createJWT()

    res.cookie('token', token, { maxAge: 3600000, httpOnly: true,sameSite: 'None', secure: true });
    // res.status(201).json({token:userAuth.createJWT(),user:{name:userAuth.name,Email:userAuth.email}})
    res.header('Access-Control-Allow-Origin', process.env.REMOTE_BASE_URL);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.redirect(process.env.REMOTE_BASE_URL);
  }
);

module.exports = router