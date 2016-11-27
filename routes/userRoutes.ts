import express = require('express');
import mongoose = require('mongoose')
import passport = require('passport');
import jwt = require('jsonwebtoken');

let User = require('../models/user');
let router = express.Router();

router.post('/Register', function(req, res, next) {
  console.log("Hitting /v1/api/Register route");
  console.log(`req.body.username: ${req.body.username}`);
  let user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  user.created_at = req.body.created_at;
  user.status = req.body.status;
  user.practiceTests = {};
  user.examsAvailable = [];
  console.log(`User: ${user}`);
  user.save(function(err, user) {
    if(err) return next(err);
    res.send("Registration Complete. Please login.");
  });
});

router.post('/Login/Local', function(req, res, next) {
  console.log('Hitting /v1/api/Login/Local');
  if(!req.body.email || !req.body.password) {
    return res.status(400).send("Please fill out every field");
  }
  // let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let user = { email: email, password: password };
  console.log(user);
  passport.authenticate('local', function(err, user, info) {
    console.log(user);
    if(err) {
      return next(err);
    }
    if(user){
      return res.json({ token : user.generateJWT() , user: user});
    } else {
      return res.status(400).send(info);
    }

  })(req, res, next);
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email' ] }));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/#/account' }),
  function(req, res) {
    if(req.isAuthenticated()) {
    let token = { token : req.user.generateJWT() };
    console.log(token.token);
    res.redirect('/#/Token/' + token.token);
    } else {
    	res.send("You are not authenticated.")
    }
  }); // end of facebook cb

export = router;
