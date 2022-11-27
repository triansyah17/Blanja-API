const express = require('express')
const Routes = express.Router()

const products = require('./products')
const category = require('./category')
const payment = require('./payment')
const toko = require('./toko')
const transaksi = require('./transaksi')
const cart = require('./cart')
const user = require('./auth')
const address = require('./address.route')


Routes
    .use('/products', products)
    .use('/category', category)
    .use('/payment', payment)
    .use('/toko', toko)
    .use('/transaksi', transaksi)
    .use('/auth', user)
    .use('/cart', cart)
    .use('/address', address)
module.exports = Routes