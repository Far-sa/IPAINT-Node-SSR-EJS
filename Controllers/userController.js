//const bcrypt = require('bcryptjs')
const passport = require('passport')
const fetch = require('node-fetch')

const User = require('../Models/users')

exports.login = async (req, res) => {
  try {
    res.render('pages/login', {
      pageTitle: 'Loging Section',
      path: '/login',
      message: req.flash('success_msg'),
      error: req.flash('error')
    })
  } catch (err) {
    console.log(err)
  }
}

exports.handleLogin = async (req, res, next) => {
  //console.log(req.body['g-recaptcha-response'])
  if (!req.body['g-recaptcha-response']) {
    req.flash('error', 'Captcha Validation is Mandetory')
    return res.redirect('/users/login')
  }

  const secretKey = process.env.CAPTCHA_SECRET
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}
  &response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`

  const response = await fetch(verifyUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    }
  })

  const json = await response.json()
  console.log(json)

  if (json.success) {
    passport.authenticate('local', {
      //successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next)
  } else {
    req.flash('error', 'Something is wrong in captcha validation')
    res.redirect('/users/login')
  }
}

exports.rememberMe = (req, res) => {
  if (req.body.remember) {
    req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000 // A day
  } else {
    req.session.cookie.expire = null
  }
  res.redirect('/dashboard')
}

exports.logout = (req, res) => {
  req.logout()
  req.flash('success_msg', 'logging out was done successfully')
  res.redirect('/users/login')
}
exports.register = async (req, res) => {
  try {
    res.render('pages/register', {
      pageTitle: 'Registarion Section',
      path: '/register'
    })
  } catch (err) {
    console.log(err)
  }
}
exports.createUser = async (req, res) => {
  const errors = []
  try {
    await User.userValidation(req.body)
    const { fullname, email, password } = req.body

    const user = await User.findOne({ email })
    if (user) {
      errors.push({ message: 'Email Already existed!' })
      return res.render('pages/register', {
        pageTitle: 'Registration Section',
        path: '/register',
        errors
      })
    }
    // const hashPassword = await bcrypt.hash(password, 10)
    // await User.create({ fullname, email, password: hashPassword })
    await User.create({ fullname, email, password })
    req.flash('success_msg', 'Registarion was successfull')
    res.redirect('/users/login')
  } catch (err) {
    console.log(err)
    // console.log(typeof err.errors)
    // console.log('ERRRRRRRRRRRRR :', err.errors)
    // res.render('pages/register', { pageTitle: '', errors: err.errors })
    //console.log('Main Error :', err)
    //const errors = []
    err.inner.forEach(e => {
      errors.push({
        name: e.path,
        message: e.message
      })
    })

    return res.render('pages/register', {
      pageTitle: 'Registration Section',
      errors
    })
  }
}
