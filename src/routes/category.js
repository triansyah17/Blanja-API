const express = require('express')
const router = express.Router()
const categoryController = require('../controller/category')
const {protect, roles} = require('../middlewares/auth')


router
  // .get('/cari', protect, roles, categoryController.searching)
  .get('/all', categoryController.getAll)
  .get('/', categoryController.getAllCategory)
  .get('/:id', categoryController.getCategory)
  .post('/', categoryController.insertCategory)
  .put('/:id', categoryController.updateCategory)
  .delete('/:id', categoryController.deleteCategory)

module.exports = router
