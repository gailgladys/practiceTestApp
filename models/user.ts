// // /models/user.js
// var mongoose = require('mongoose');
//
// var userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: String,
//   status: String,
//   created_at: Date,
//   updated_at: Date
// });
//
// var User = mongoose.model('User', userSchema);
//
// // Make this available to our other files
// module.exports = User;

import mongoose = require('mongoose');
import crypto = require('crypto');
import jwt = require("jsonwebtoken");

let UserSchema = new mongoose.Schema({
  username: { type: String, unique: true},
  email: { type: String, unique: true},
  status: String,
  practiceTests: Object,
  grades: Object,
  examsAvailable: Array,
  examNames: Object,
  passwordHash: String,
  salt: String,
  created_at: Date
})

UserSchema.method('setPassword', function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
});

UserSchema.method('validatePassword', function(password) {
  let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return (hash === this.passwordHash);
});

UserSchema.method('generateJWT', function() {
  return jwt.sign({
    id: this._id,
    username: this.username,
    email: this.email
  }, 'SecretKey');
});

let User = mongoose.model('User', UserSchema);
//
// // Make this available to our other files
module.exports = User;


// export let User = mongoose.model("User", UserSchema);
