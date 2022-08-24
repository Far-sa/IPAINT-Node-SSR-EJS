const passport = require('passport')
const { Strategy } = require('passport-local')
const bcrypt = require('bcryptjs')

const User = require('../Models/users')

passport.use(
  new Strategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email })
      if (!user) {
        return done(null, false, {
          message: 'No user has been registered with this Emial '
        })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (isMatch) {
        return done(null, user) //req.user
      } else {
        return done(null, false, {
          message: ' Email or Password is invalid! '
        })
      }
    } catch (err) {
      console.log(err)
    }
  })
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})
