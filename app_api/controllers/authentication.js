"use strict";
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var crypto = require("crypto");
var async = require('async');
var gravatar = require('gravatar');
module.exports.register = function (req, res) {
    var user = new User();
    console.log('Authentication.register hit');
    user.username = req.body.username;
    user.email = req.body.email;
    user.role = 'student';
    var avatar = gravatar.url(req.body.email);
    user.avatar = avatar;
    user.setPassword(req.body.password);
    console.log("user: " + user);
    user.save(function (err) {
        var token;
        token = user.generateJwt();
        console.log("user.save - token: " + token);
        res.status(200);
        res.json({
            "token": token
        });
    });
};
module.exports.login = function (req, res) {
    console.log('Authentication.login hit');
    passport.authenticate('local', function (err, user, info) {
        var token;
        console.log("local authenticate - user: " + user);
        console.log("local authenticate - info: " + info);
        if (err) {
            res.status(404).json(err);
            return;
        }
        if (user) {
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token": token
            });
        }
        else {
            res.status(401).json(info);
        }
    })(req, res);
};
module.exports.forgot = function (req, res, next) {
    console.log('hit ctrlAuth.forgot');
    console.log('process.env.TESTAPP_USER: ', process.env.TESTAPP_USER);
    console.log('process.env.TESTAPP_PASS: ', process.env.TESTAPP_PASS);
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                console.log("token: " + token);
                done(err, token);
            });
        },
        function (token, done) {
            console.log("email: " + req.body.email);
            User.findOne({ email: req.body.email }, function (err, user) {
                console.log("user: " + JSON.stringify(user));
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    res.json({ error: 'No account with that email address exists.' });
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;
                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            console.log("auth.user: " + process.env.TESTAPP_USER);
            console.log("user.email: " + user.email);
            var helper = require('sendgrid').mail;
            var from_email = new helper.Email(process.env.TESTAPP_USER);
            var to_email = new helper.Email(user.email);
            var subject = "Node.js Password Reset";
            var content = new helper.Content("text/plain", "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\nhttp://" + req.headers.host + "/reset/" + token + "\n\n");
            var mail = new helper.Mail(from_email, subject, to_email, content);
            var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
            var request = sg.emptyRequest({
                method: 'POST',
                path: '/v3/mail/send',
                body: mail.toJSON()
            });
            sg.API(request, function (error, response) {
                console.log(response.statusCode);
                console.log(response.body);
                console.log(response.headers);
            });
            res.json({ sucess: 'email sent' });
        }
    ], function (err) {
        if (err)
            return next(err);
        return;
    });
};
module.exports.reset = function (req, res, next) {
    console.log('hit ctrlAuth.forgot');
    console.log('process.env.TESTAPP_USER: ', process.env.TESTAPP_USER);
    console.log('process.env.TESTAPP_PASS: ', process.env.TESTAPP_PASS);
    async.waterfall([
        function (done) {
            console.log("password: " + req.body.password);
            console.log("token: " + req.body.token);
            User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                console.log("user: " + JSON.stringify(user));
                if (!user) {
                    return { error: 'Password reset token is invalid or has expired.' };
                }
                user.setPassword(req.body.password);
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                user.save(function (err) {
                    done(err, user);
                });
            });
        },
        function (user, done) {
            console.log("auth.user: " + process.env.TESTAPP_USER);
            console.log("user.email: " + user.email);
            var helper = require('sendgrid').mail;
            var from_email = new helper.Email(process.env.TESTAPP_USER);
            var to_email = new helper.Email(user.email);
            var subject = "Your password has been changed";
            var content = new helper.Content("text/plain", "Hello,\n\nThis is a confirmation that the password for your account " + user.email + " has just been changed.\n");
            var mail = new helper.Mail(from_email, subject, to_email, content);
            var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
            var request = sg.emptyRequest({
                method: 'POST',
                path: '/v3/mail/send',
                body: mail.toJSON()
            });
            sg.API(request, function (error, response) {
                console.log(response.statusCode);
                console.log(response.body);
                console.log(response.headers);
            });
            res.json({ sucess: 'email sent' });
        }
    ], function (err) {
        if (err)
            return next(err);
        return;
    });
};
