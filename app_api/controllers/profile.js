"use strict";
var mongoose = require("mongoose");
var User = mongoose.model('User');
var Question = mongoose.model('Question');
var Exam = mongoose.model('Exam');
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
module.exports.examBank = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    }
    else {
        var questArray = req.param('questArray');
        if (questArray) {
            Question.find({ _id: { "$in": questArray } }, function (err, questions) {
                res.json(questions);
            });
        }
        else {
            res.json("no questArray submitted");
        }
    }
};
