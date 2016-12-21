"use strict";
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var logger = require("morgan");
var favicon = require("serve-favicon");
var passport = require("passport");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var csrf = require("csurf");
var methodOverride = require("method-override");
var gravatar = require('gravatar');
require('./app_api/models/user');
require('./app_api/models/question');
require('./app_api/models/exam');
require('./app_api/config/passport');
var routes = require('./app_api/routes/index');
var app = express();
var port = process.env.PORT || 3000;
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
app.set('view engine', 'html');
app.set('view options', {
    layout: false
});
app.use(favicon(path.join(__dirname, 'public', 'images/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
    secret: process.env.COOKIE_SECRET || "Superdupersecret"
}));
var env = process.env.NODE_ENV || 'development';
if ('development' === env || 'production' === env) {
    app.use(csrf());
    app.use(function (req, res, next) {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        next();
    });
}
app.use(passport.initialize());
app.use(passport.session());
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI16);
app.use('/', routes);
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({ "message": err.name + ": " + err.message });
    }
});
var server = app.listen(3000, 'localhost', function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server is running on " + host + ":" + port);
});
module.exports = app;
