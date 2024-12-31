const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        // Find the user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
          return done(null, false, { msg: `Email ${email} not found.` });
        }

        // Check if the user has a password
        if (!user.password) {
          return done(null, false, {
            msg: 'Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.',
          });
        }

        // Compare the password
        const isMatch = await user.comparePassword(password); // Assuming comparePassword is a promise-based method
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { msg: 'Invalid email or password.' });
        }
      } catch (err) {
        return done(err);
      }
    })
  );
  

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id); // Use async/await to fetch the user
      done(null, user); // Pass the user to the done callback
    } catch (err) {
      done(err); // Pass any error to the done callback
    }
  });
}
