import passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
import mongoose = require('mongoose');
let User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    console.log(`passport.use LocalStrategy - username: ${username}`);
    console.log(`passport.use LocalStrategy - password: ${password}`);
    User.findOne({ email: username }, function (err, user) {
      console.log(`User.findOne - user: ${user}`);
      if (err) { return done(err); }
      // Return if user not found in database
      if (!user) {
        return done(null, false, {
          message: 'User not found'
        });
      }
      // Return if password is wrong
      if (!user.validatePassword(password)) {
        return done(null, false, {
          message: 'Password is wrong'
        });
      }
      // If credentials are correct, return the user object
      return done(null, user);
    });
  }
));
