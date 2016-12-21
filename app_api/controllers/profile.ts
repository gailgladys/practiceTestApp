import mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.profileRead = function(req, res) {

  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    // Otherwise continue
    User
      .findById(req.payload._id)
      .select('-passwordHash -salt')
      .exec(function(err, result) {
        console.log(`result: ${result}`);
        res.status(200).json(result);
      });
  }

};
