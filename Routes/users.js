const express = require('express')

const userController = require('../Controllers/userController')
const { authenticated } = require('../Middlewares/auth')

const router = express.Router()

//* desc Login Page
//* Route GET /users/login
router.get('/login', userController.login)

//* desc Handle Login
//* Route POST /users/login
router.post('/login', userController.handleLogin, userController.rememberMe)

//* desc Handle Logout
//* Route GET /users/login
router.get('/logout', authenticated, userController.logout)

//* @desc Register Page
//* Route GET /users/register
router.get('/register', userController.register)

//* @desc Handle Register
//* Route POST /users/register
router.post('/register', userController.createUser)

module.exports = router
