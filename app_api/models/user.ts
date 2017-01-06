import mongoose = require('mongoose');
import crypto = require('crypto');
import jwt = require("jsonwebtoken");

var userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true},
  email: { type: String, required: true, unique: true},
  passwordHash: String,
  salt: String,
  role: String,
  avatar: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  practiceTests: Object,
  gradeArray: Object,
  examsAvailable: Array,
  examNames: Object,
  created_at: Date,
  updated_at: Date
});

userSchema.method('setPassword', function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
});

userSchema.method('validatePassword', function(password) {
  let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return (hash === this.passwordHash);
});

userSchema.method('generateJwt', function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate()+7);
  console.log(`expiry: ${expiry}`);
  console.log(`expiry.getTime(): ${expiry.getTime()}`);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET");
});

var User = mongoose.model('User', userSchema);

// Make this available to our other files
module.exports = User;
