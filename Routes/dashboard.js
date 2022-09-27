const { Router } = require('express')

const { authenticated } = require('../Middlewares/auth')

const router = new Router()

//* @desc Dashboard
//* Route GET /dashboad
router.get('/', authenticated, (req, res) => {
  res.render('pages/dashboard', {
    pageTitle: 'Managment Section',
    path: '/dashboard',
    fullname : req.user.fullname
  })
})

module.exports = router
