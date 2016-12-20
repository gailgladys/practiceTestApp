"use strict";
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require("mongoose");
var User = mongoose.model('User');
passport.use(new LocalStrategy({
    usernameField: 'email'
}, function (username, password, done) {
    console.log("passport.use LocalStrategy - username: " + username);
    console.log("passport.use LocalStrategy - password: " + password);
    User.findOne({ email: username }, function (err, user) {
        console.log("User.findOne - user: " + user);
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {
                message: 'User not found'
            });
        }
        if (!user.validatePassword(password)) {
            return done(null, false, {
                message: 'Password is wrong'
            });
        }
        return done(null, user);
    });
}));
