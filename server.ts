import express = require('express');
import path = require('path');
import bodyParser = require('body-parser');
import logger = require('morgan');
import favicon = require('serve-favicon');
import passport = require("passport");
import flash = require('connect-flash');
import cookieParser = require('cookie-parser');
import cookieSession = require('cookie-session');
import session = require('express-session');
import csrf = require('csurf');
import methodOverride = require('method-override');

require('./app_api/models/user');
require('./app_api/config/passport');

let routes = require('./app_api/routes/index');
let app = express();
let port = process.env.PORT || 3000;

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
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
app.use(session(
    {
        secret: process.env.COOKIE_SECRET || "Superdupersecret"
    }));

var env = process.env.NODE_ENV || 'development';
if ('development' === env || 'production' === env) {
    app.use(csrf());
    app.use(function(req, res, next) {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        next();
    });
}

app.use(passport.initialize());
app.use(passport.session());

// Mongoose connection
let mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI16);

// Connect flash
app.use(flash());

//Global Vars
app.use(function(req,res,next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);

let server = app.listen(3000, 'localhost', function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log(`Server is running on ${host}:${port}`);
});

module.exports = app;
