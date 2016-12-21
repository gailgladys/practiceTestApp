"use strict";
var mongoose = require("mongoose");
var User = mongoose.model('User');
module.exports.profileRead = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    }
    else {
        User
            .findById(req.payload._id)
            .select('-passwordHash -salt')
            .exec(function (err, result) {
            console.log("result: " + result);
            res.status(200).json(result);
        });
    }
};
