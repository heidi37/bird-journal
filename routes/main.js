const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth') 
const homeController = require('../controllers/home')
const { createUser } = require('../controllers/auth');


router.get('/', homeController.getIndex)
router.get('/users', homeController.getUsers)
router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)
router.get('/logout', authController.logout)
router.get('/signup', authController.getSignup)
router.post('/signup', createUser)


module.exports = router