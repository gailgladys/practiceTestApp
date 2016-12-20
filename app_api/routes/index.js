"use strict";
var express = require("express");
var router = express.Router();
var jwt = require("express-jwt");
var auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Question = require('../models/question');
var Exam = require('../models/exam');
var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
router.get('/', function (req, res) {
    res.render('index');
});
router.get('/getStud', function (req, res) {
    var email = req.param('email');
    console.log("/getStud route hit. email: " + email);
    User.findOne({ email: email }, function (err, student) {
        console.log(student);
        res.json(student);
    });
});
router.get('/examBank', function (req, res, next) {
    var questArray = req.param('questArray');
    if (questArray) {
        Question.find({ _id: { "$in": questArray } }, function (err, questions) {
            res.json(questions);
        });
    }
    else {
        res.json("no questArray submitted");
    }
});
router.get('/adminExamAssign', function (req, res) {
    console.log('Hi there - this should show up: hitting adminExamAssign route');
    var examNum = req.param('examNum');
    console.log("examNum: " + examNum);
    var examName = req.param('examName');
    console.log("examName: " + examName);
    var studentStr = req.param('student');
    console.log("studentStr: " + studentStr);
    var student = JSON.parse(studentStr);
    console.log("student: " + student);
    if (examNum) {
        Question.find({ examNum: examNum }, function (err, questions) {
            var examObj = {};
            var displayObj = {};
            var counter = 0;
            var tempArray = [];
            var tempDBArray = [];
            var subExam = 1;
            var dis = {};
            var db = "";
            console.log('questions.length: ', questions.length);
            while (questions.length > 0) {
                console.log('subExam: ', subExam, ' questions.length: ', questions.length, ' tempArray.length: ', tempArray.length);
                if (tempArray.length < 20) {
                    dis = questions.splice(Math.random() * questions.length, 1)[0];
                    console.log('questions.length: ', questions.length);
                    db = dis['_id'].toString();
                    tempArray.push(dis);
                    console.log('tempArray.length: ', tempArray.length);
                    examObj[subExam] = tempDBArray;
                    dis = {};
                    tempDBArray.push(db);
                    displayObj[subExam] = tempArray;
                    db = "";
                }
                else {
                    tempArray = [];
                    tempDBArray = [];
                    subExam++;
                }
            }
            console.log("examArray: " + examObj);
            if (student) {
                console.log("student: " + student);
                console.log("student_id: " + student._id);
                console.log("examNum: " + examNum);
                console.log("examName: " + examName);
                console.log("student.status: " + student.status);
                if (student.practiceTests) {
                    student.practiceTests[examNum] = examObj;
                }
                else {
                    student['practiceTests'] = {};
                    student.practiceTests[examNum] = examObj;
                }
                console.log("student.practiceTests[examNum]: " + student.practiceTests[examNum]);
                if (student.examNames) {
                    student.examNames[examNum] = examName;
                }
                else {
                    student['examNames'] = {};
                    student.examNames[examNum] = examName;
                }
                console.log("student.examNames[examNum]: " + student.examNames[examNum]);
                if (student.examsAvailable.indexOf(examNum) == -1) {
                    student.examsAvailable.push(examNum);
                    console.log("student.examsAvailable: " + student.examsAvailable);
                }
                console.log("student(modified): " + student);
                User.update({ '_id': student._id }, { 'practiceTests': student.practiceTests, 'examsAvailable': student.examsAvailable, 'examNames': student.examNames }, function (err, resp) {
                    if (err)
                        return err;
                    console.log('edited practiceTest');
                    console.log("resp: " + JSON.stringify(resp));
                    console.log("student: " + JSON.stringify(student));
                    res.json(student);
                });
            }
            else {
                res.json('failed to save');
            }
        });
    }
    else {
        res.json('please enter an exam number');
    }
});
router.get('/Admin', function (req, res, next) {
    console.log("Hitting /Admin route");
    User.find({}, function (err, students) {
        console.log(students);
        res.json(students);
    });
});
router.get('/questionForm', function (req, res, next) {
    var number = 1;
    Question.find({}, function (err, questions) {
        console.log(questions);
        console.log("hitting database");
        console.log(questions.length);
        if (questions) {
            number += questions.length;
            console.log("Question number: ", number);
        }
        res.render('questionForm', { title: "Question Entry Form", number: number });
    });
});
router.post('/questionData', function (req, res, next) {
    console.log('hitting questionData route');
    var examName = req.body.examName;
    var data = {
        examNum: req.body.examNum,
        selectTwo: req.body.selectTwo,
        question: req.body.question,
        answerA: req.body.answerA,
        answerB: req.body.answerB,
        answerC: req.body.answerC,
        answerD: req.body.answerD,
        answerE: req.body.answerE,
        correctAnswer: req.body.correctAnswer,
        created_at: req.body.created_at
    };
    console.log(data);
    var question = new Question(data);
    console.log(question);
    question.save(function (err, question) {
        if (err)
            return next(err);
        console.log('Saved question');
        console.log(question);
        Exam.findOne({}, function (err, doc) {
            console.log("Exam.findOne examName: " + examName);
            if (doc) {
                console.log('first if(doc): exam findOne returned something');
                if (doc.examAvailable.indexOf(question.examNum) == -1) {
                    console.log('second if(doc.examAvailable.indexOf(question.examNum)==-1): this is a new exam number and will be added to exam available array');
                    doc.examAvailable.push(question.examNum);
                }
                if (doc.examNames) {
                    console.log('third if(doc.examNames): exam names as a field exists');
                    if (examName) {
                        console.log('fourth if(examName) the user entered something for the name field - maybe for first time or rename');
                        console.log("doc.examNames[question.examNum]: " + doc.examNames[question.examNum]);
                        console.log("examName: " + examName);
                        doc.examNames[question.examNum] = examName;
                        console.log("after set = to examName - doc.examNames[question.examNum]: " + doc.examNames[question.examNum]);
                    }
                }
                else {
                    console.log('else - new name entry even if ""');
                    doc.examNames = {};
                    doc.examNames[question.examNum] = examName;
                }
                console.log('as long as doc returned - all paths lead here - to save exam');
                Exam.update({}, { 'examNames': doc.examNames }, function (err, exam) {
                    if (err)
                        return next(err);
                    console.log('edited exam');
                    console.log("exam: " + exam);
                    Question.find({ examNum: question.examNum }, function (err, questions) {
                        res.json({ questionNum: questions.length + 1, examName: examName });
                    });
                });
            }
            else {
                var arr = [question.examNum];
                var data_1 = { examAvailable: arr };
                var exam = new Exam(data_1);
                exam.save(function (err, exam) {
                    if (err)
                        return next(err);
                    console.log('Saved exam');
                    console.log(exam);
                    Question.find({ examNum: question.examNum }, function (err, questions) {
                        res.json({ questionNum: questions.length + 1 });
                    });
                });
            }
        });
    });
});
router.get('/testBank', function (req, res, next) {
    var examNum = req.param('examNum');
    console.log(examNum);
    if (examNum) {
        Question.find({ examNum: examNum }, function (err, questions) {
            console.log("questions: " + questions);
            console.log("questions.length: " + questions.length);
            console.log("err: " + err);
            if (questions.length) {
                Exam.findOne({}, function (err, exam) {
                    var examName = exam.examNames[examNum.toString()];
                    res.json({ questions: questions, examName: examName });
                });
            }
            else {
                console.log('no matches');
                res.json({ questions: "" });
            }
        });
    }
    else {
        res.json("no exam number entered");
    }
});
router.get('/secret', auth, ctrlProfile.profileRead);
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.get('/*', function (req, res, next) {
    if (/.js|.html|.css|templates|js|scripts/.test(req.path) || req.xhr) {
        return next({ status: 404, message: 'Not Found' });
    }
    else {
        return res.render('index.html');
    }
});
module.exports = router;
