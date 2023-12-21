const express = require('express')
const router = express.Router()
const {
  getAllDepts,
  getDept,
  createDept,
  updateDept,
  deleteDept
} = require('../controllers/Deptor')

router.route('/').get(getAllDepts).post(createDept)
router.route('/:id').get(getDept).delete(deleteDept).patch(updateDept)

module.exports = router