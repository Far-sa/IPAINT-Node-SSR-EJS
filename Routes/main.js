const express = require('express')

const router = express.Router()

//* desc weblog indexPage
//* Route GET /
router.get('/', (req, res) => {
  res.render('pages/index', { pageTitle: 'iPaint', path: '/' })
})

//* Main GET Routes
router.get('/gallery', (req, res) => {
  res.render('pages/gallery', { pageTitle: 'Gallery', path: '/gallery' })
})

router.get('/contact', (req, res) => {
  res.render('pages/contact', { pageTitle: 'Contact us', path: '/contact' })
})
module.exports = router
