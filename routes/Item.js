const express = require('express')
const router = express.Router()
const {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/Item')

router.route('/').get(getAllItems).post(createItem)
router.route('/:itemId').get(getItem).delete(deleteItem).patch(updateItem)

module.exports = router