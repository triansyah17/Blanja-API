const express = require('express')
const router = express.Router()

const controllersAddress = require('../controller/address.contollers')
const { protect } = require('../middlewares/auth')

router
    .post('/', protect, controllersAddress.create)
    .put('/', protect, controllersAddress.updateAddress)
    .get('/', protect, controllersAddress.getAddressUser)


module.exports = router