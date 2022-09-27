const path = require('path')

const express = require('express')
const dotenv = require('dotenv')
const passport = require('passport')
//const expressLayout = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const debug = require('debug')('Ipaint')
const morgan = require('morgan')
const flash = require('connect-flash')
const session = require('express-session')
const MongoStore = require('connect-mongo')

const connectDB = require('./Config/db')
const winston = require('./Config/winston')

//? Load Config
dotenv.config({ path: './Config/.env' })

//* Databse
connectDB()
debug('Connected to the Database!')

//* Passport Config
require('./Config/passport')
//? End - Load Config

const app = express()

//? Middlewares
//* Log
if (process.env.NODE_ENV === 'development') {
  debug('Morgan Enabled')
  app.use(morgan('combined', { stream: winston.stream }))
}

//* Parse
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//* View Engine
//app.use(expressLayout)
app.set('view engine', 'ejs')
//app.set('layout', './layouts/mainLayout')
app.set('views', 'Views')

//* Sessions
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
  })
)

//* Passport
app.use(passport.initialize())
app.use(passport.session())

//* Flash Messages
app.use(flash())
//? End- Middlewares

//* Static Folder
app.use(express.static(path.join(__dirname, 'Public')))

//? Routes
app.use('/', require('./Routes/main'))
app.use('/users', require('./Routes/users'))
app.use('/dashboard', require('./Routes/dashboard'))

//* 404 Route
app.use((req, res) => {
  res.render('pages/404', { pageTitle: '', path: '/404' })
})

//? Lunch App
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on ${PORT}`)
})
