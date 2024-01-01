const express = require('express')
const router = express.Router()
const { getUser,isLoggedIn } = require('../controllers/User')

router.route('/').get(getUser)
router.route('/is-logged-in').get(isLoggedIn)

module.exports = router