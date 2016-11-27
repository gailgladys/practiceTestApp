import express = require('express');
import path = require('path');
import bodyParser = require('body-parser');
import logger = require('morgan');
import favicon = require('serve-favicon');
import passport = require("passport");

let routes = require('./routes/route');
let app = express();
let port = process.env.PORT || 3000;

require('./models/user');
require('./config/passport');

app.set('views', path.join(__dirname, 'views'));
//set the view engine that will render HTML from the server to the client
app.engine('.html', require('ejs').renderFile);
//Allow for these directories to be usable on the client side
app.use(express.static(__dirname + '/public'));
// app.use(express.static('./public'));
app.use(express.static(__dirname + '/bower_components'));
//we want to render html files
app.set('view engine', 'html');
app.set('view options', {
	layout: false
});

app.use(favicon(path.join(__dirname, 'public', 'images/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());

// Mongoose connection
let mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI16);

app.use('/', routes);
let userRoutes = require("./routes/userRoutes");
app.use('/v1/api/',userRoutes);


let server = app.listen(3000, 'localhost', function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log(`Server is running on ${host}:${port}`);
});

module.exports = app;
