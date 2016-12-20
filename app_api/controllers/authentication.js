var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
module.exports.register = function (req, res) {
    var user = new User();
    console.log('Authentication.register hit');
    user.username = req.body.username;
    user.email = req.body.email;
    user.role = 'student';
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
