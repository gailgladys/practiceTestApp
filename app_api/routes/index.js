"use strict";
var express = require("express");
var router = express.Router();
var jwt = require("express-jwt");
var auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});
var gravatar = require('gravatar');
var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
var ctrlAdmin = require('../controllers/admin');
router.get('/profile', auth, ctrlProfile.profileRead);
router.get('/admin', auth, ctrlAdmin.adminRead);
router.get('/adminAssign', auth, ctrlAdmin.adminAssign);
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.post('/forgot', ctrlAuth.forgot);
router.post('/reset', ctrlAuth.reset);
router.get('/', function (req, res) {
    res.render('index');
});
router.get('/*', function (req, res, next) {
    if (/.js|.html|.css|templates|js|scripts/.test(req.path) || req.xhr) {
        return next({ status: 404, message: 'Not Found' });
    }
    else {
        return res.render('index.html');
    }
});
module.exports = router;
