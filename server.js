"use strict";
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var passport = require("passport");
var routes = require('./routes/route');
var app = express();
var port = process.env.PORT || 3000;
require('./models/user');
require('./config/passport');
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
app.use(passport.initialize());
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI16);
app.use('/', routes);
var userRoutes = require("./routes/userRoutes");
app.use('/v1/api/', userRoutes);
var server = app.listen(3000, 'localhost', function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server is running on " + host + ":" + port);
});
module.exports = app;
