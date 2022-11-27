const express = require('express')
const router = express.Router()
const {protect} = require('../middlewares/auth')
const storeController = require('../controller/Store.controller')
const upload = require('../middlewares/upload')

router
    .get('/', storeController.getStore)
    .get('/:id', storeController.getStoreById)
    .put('/update/:id', upload, storeController.updateStore)
module.exports = router