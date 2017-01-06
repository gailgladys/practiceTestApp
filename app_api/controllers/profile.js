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
module.exports.examUpdate = function (req, res, next) {
    console.log('hit examUpdate');
    console.log("req: " + req);
    console.log("req.payload.role: " + req.payload.role);
    console.log("req.payload._id: " + req.payload._id);
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    }
    else {
        console.log("req.body.examName: " + req.body.examNum);
        var examNum = req.body.examName;
        var subExamNum = req.body.subExamNum;
        var answered = req.body.answered;
        var answers = req.body.answers;
        var elapsedTime = req.body.elapsedTime;
        var attemptNum = req.body.attemptNum;
        User.findOne({ _id: req.payload._id }, function (err, user) {
            if (user.gradeArray[examNum][subExamNum][attemptNum]) {
                console.log('already have a saved attempt in this slot');
                user.gradeArray[examNum][subExamNum][attemptNum].answered = answered;
                user.gradeArray[examNum][subExamNum][attemptNum].answers = answers;
                user.gradeArray[examNum][subExamNum][attemptNum].elapsedTime = elapsedTime;
                user.save(function (err, updatedUser) {
                    if (err)
                        return err;
                    console.log("updatedUser: " + updatedUser);
                    res.send('updated');
                });
            }
            else if (user.gradeArray[examNum][subExamNum]) {
                console.log('have prior attempts in this slot but this is a new one');
                user.gradeArray[examNum][subExamNum][attemptNum] = { answered: answered, answers: answers, elapsedTime: elapsedTime };
                user.save(function (err, updatedUser) {
                    if (err)
                        return err;
                    console.log("updatedUser: " + updatedUser);
                    res.send('updated');
                });
            }
            else {
                console.log('new attempt for this subexam');
                user.gradeArray[examNum][subExamNum] = [{ answered: answered, answers: answers, elapsedTime: elapsedTime }];
                user.save(function (err, updatedUser) {
                    if (err)
                        return err;
                    console.log("updatedUser: " + updatedUser);
                    res.send('updated');
                });
            }
        });
    }
};
module.exports.gradeExam = function (req, res, next) {
    console.log('hit gradeExam');
    console.log("req: " + req);
    console.log("req.payload.role: " + req.payload.role);
    console.log("req.payload._id: " + req.payload._id);
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    }
    else {
        console.log("req.body.examNum: " + req.body.examNum);
        console.log("req.body.subExamNum: " + req.body.subExamNum);
        console.log("req.body.answered: " + req.body.answered);
        console.log("req.body.answers: " + req.body.answers);
        console.log("req.body.elapsedTime: " + req.body.elapsedTime);
        console.log("req.body.attemptNum: " + req.body.attemptNum);
        console.log("req.body.finalGrade: " + req.body.finalGrade);
        console.log("req.body.rightWrongArray: " + req.body.rightWrongArray);
        var examNum = req.body.examNum;
        var subExamNum = req.body.subExamNum;
        var answered = req.body.answered;
        var answers = req.body.answers;
        var elapsedTime = req.body.elapsedTime;
        var attemptNum = 1;
        var finalGrade = req.body.finalGrade;
        var rightWrongArray = req.body.rightWrongArray;
        console.log("examNum: " + examNum);
        console.log("subExamNum: " + subExamNum);
        console.log("answered: " + answered);
        console.log("answers: " + answers);
        console.log("elapsedTime: " + elapsedTime);
        console.log("attemptNum: " + attemptNum);
        console.log("finalGrade: " + finalGrade);
        console.log("rightWrongArray: " + rightWrongArray);
        var data_1 = { answered: answered, answers: answers, elapsedTime: elapsedTime, finalGrade: finalGrade, rightWrongArray: rightWrongArray, completed: true };
        console.log("data: " + JSON.stringify(data_1));
        var key = 'gradeArray[' + examNum + '][' + subExamNum + '][' + attemptNum + ']';
        console.log("key: " + key);
        User.findOne({ _id: req.payload._id }, function (err, user) {
            console.log("user: " + JSON.stringify(user));
            console.log("user['gradeArray']:\n      " + JSON.stringify(user['gradeArray']));
            console.log("examNum: " + examNum + ", subExamNum: " + subExamNum + ", attemptNum: " + attemptNum);
            console.log("user['gradeArray'][examNum][subExamNum][attemptNum]:\n      " + JSON.stringify(user['gradeArray'][examNum][subExamNum][attemptNum]));
            user['gradeArray'][examNum][subExamNum][attemptNum] = data_1;
            console.log("user['gradeArray'][examNum][subExamNum][attemptNum]:\n      " + JSON.stringify(user['gradeArray'][examNum][subExamNum][attemptNum]));
            console.log("user['username']: " + user['username']);
            user['username'] = 'Whoa';
            user.save(function (err, user) {
                if (err)
                    return err;
                console.log("user: " + JSON.stringify(user));
                res.send('updated');
            });
        });
    }
};
