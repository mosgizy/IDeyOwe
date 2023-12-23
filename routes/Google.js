const express = require('express')
const router = express.Router()
const passport = require('passport')
const Auth = require('../models/Auth')

router.route('/').get(passport.authenticate('google', { scope: ['profile', 'email'] }));

router.route('/callback').get(passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    const { user } = req
    
    // console.log(user)

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

    res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
    // res.status(201).json({token:userAuth.createJWT(),user:{name:userAuth.name,Email:userAuth.email}})
    res.redirect('/api/v1/dept');
  }
);

module.exports = router