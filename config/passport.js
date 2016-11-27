"use strict";
var passport = require('passport');
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = mongoose.model('User');
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});
passport.use('local', new LocalStrategy({ usernameField: 'email' }, function (username, password, done) {
    User.findOne({ email: username }, function (err, user) {
        if (err)
            return done(err);
        if (!user)
            return done(null, false, { message: 'Incorrect username.' });
        if (!user.validatePassword(password))
            return done(null, false, { message: 'Password does not match.' });
        return done(null, user);
    });
}));
