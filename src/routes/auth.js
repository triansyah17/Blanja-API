const express = require('express')
const router = express.Router()
const { register, login, profile, refreshToken, selectAll, ActivateAccount, updatePhotoProfile } = require('../controller/auth')
const {protect, roles} = require('../middlewares/auth')
const upload = require('../middlewares/upload')


router
.post('/register',register)
.post('/login',login)
.get('/activate/:token', ActivateAccount)
.post('/refersh-token', refreshToken)
.get('/profile',protect, profile)
// .put('/update',protect, upload, updatePhotoProfile)
.put('/updateImg',protect, upload, updatePhotoProfile)
.get('/', selectAll)


module.exports = router