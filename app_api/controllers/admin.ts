import mongoose = require('mongoose');
var User = mongoose.model('User');
var Question = mongoose.model('Question');
var Exam = mongoose.model('Exam');

module.exports.adminRead = function(req, res) {
  console.log('hit adminRead');
  console.log(`req: ${req}`);
  console.log(`req.payload.role: ${req.payload.role}`);
  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else if (req.payload.role != 'admin'){
    res.status(401).json({
      "message" : "UnauthorizedError: not admin"
    });
  } else {
    // Otherwise continue
    User
      .find({})
      .exec(function(err, users) {
        res.status(200).json(users);
      });
  }

};

module.exports.adminAssign = function(req, res) {
  console.log('hit adminAssign');
  console.log(`req: ${req}`);
  console.log(`req.payload.role: ${req.payload.role}`);
  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else if (req.payload.role != 'admin'){
    res.status(401).json({
      "message" : "UnauthorizedError: not admin"
    });
  } else {
    // Otherwise continue
    User
      .find({})
      .exec(function(err, users) {
        Exam
        .find({})
        .exec(function (err, exams) {
          res.status(200).json({users:users,exams:exams});
      });
    });
  }

};
