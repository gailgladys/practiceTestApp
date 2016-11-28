"use strict";
var express = require("express");
var passport = require("passport");
var User = require('../models/user');
var Question = require('../models/question');
var Exam = require('../models/exam');
var router = express.Router();
router.get('/', function (req, res) {
    res.render('index');
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
router.get('/examsAvailable', function (req, res) {
    Exam.find({}, function (err, exams) {
        res.json(exams);
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
        res.json(displayObj);
    }
});
router.get('/testRandomizer', function (req, res, next) {
    var examNum = req.param('examNum');
    console.log("examNum: " + examNum);
    var username = req.param('username');
    var email = req.param('email');
    console.log("username: " + username);
    console.log("email: " + email);
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
                if (tempArray.length < 2) {
                    dis = questions.splice(Math.random() * questions.length, 1)[0];
                    console.log('questions.length: ', questions.length);
                    db = dis['_id'].toString();
                    tempArray.push(dis);
                    console.log('tempArray: ', tempArray);
                    examObj[subExam] = tempDBArray;
                    dis = {};
                    tempDBArray.push(db);
                    console.log('tempDBArray: ', tempDBArray);
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
            if (email) {
                console.log("email: " + email);
                User.findOne({ 'email': email }, function (err, doc) {
                    if (doc) {
                        console.log("doc: " + doc);
                        console.log("examNum: " + examNum);
                        console.log("doc.status: " + doc.status);
                        if (doc.practiceTests) {
                            doc.practiceTests[examNum] = examObj;
                        }
                        else {
                            doc['practiceTests'] = {};
                            doc.practiceTests['exam' + examNum] = examObj;
                        }
                        console.log("doc.practiceTests['exam'+examNum]: " + doc.practiceTests['exam' + examNum]);
                        if (doc.examsAvailable.indexOf(examNum) == -1) {
                            doc.examsAvailable.push(examNum);
                            console.log("doc.examsAvailable: " + doc.examsAvailable);
                        }
                        console.log("doc(modified): " + doc);
                        User.update({ 'email': email }, { 'practiceTests': doc.practiceTests, 'examsAvailable': doc.examsAvailable }, function (err, resp) {
                            if (err)
                                return next(err);
                            console.log('edited practiceTest');
                            console.log("resp: " + resp);
                            res.json(displayObj);
                        });
                    }
                    else {
                        res.json('failed to save');
                    }
                });
            }
            else {
                res.json(displayObj);
            }
        });
    }
    else {
        res.json("no exam number entered");
    }
});
router.get('/testArray', function (req, res, next) {
    var examNum = req.param('examNum');
    var testArray = req.param('testArray');
    if (examNum) {
        Question.find({ examNum: examNum }, function (err, questions) {
            var string = "";
            var matches = questions.filter(function (question) {
                return testArray.indexOf(question['_id'].toString()) > -1;
            });
            res.json(matches);
        });
    }
    else {
        res.json("no exam number entered");
    }
});
router.get('/getStud', function (req, res) {
    var email = req.param('email');
    User.findOne({ email: email }, function (err, student) {
        console.log(student);
        res.json(student);
    });
});
router.get('/Admin', function (req, res, next) {
    console.log("Hitting /Admin route");
    User.find({ status: "student" }, function (err, students) {
        console.log(students);
        res.json(students);
    });
});
router.get('/test', function (req, res, next) {
    Question.find({}, function (err, questions) {
        res.render('testBank', { title: "Gail's Quiz App", questions: questions });
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
router.post('/Register', function (req, res, next) {
    var user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    user.save(function (err, user) {
        if (err)
            return next(err);
        res.send("Registration Complete. Please login.");
    });
});
router.post('/Login/Local', function (req, res, next) {
    if (!req.body.username || !req.body.password)
        return res.status(400).send("Please fill out every field");
    passport.authenticate('local', function (err, user, info) {
        console.log(user);
        if (err)
            return next(err);
        if (user)
            return res.json({ token: user.generateJWT() });
        return res.status(400).send(info);
    })(req, res, next);
});
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/#/account' }), function (req, res) {
    if (req.isAuthenticated()) {
        var token = { token: req.user.generateJWT() };
        console.log(token.token);
        res.redirect('/#/Token/' + token.token);
    }
    else {
        res.send("You are not authenticated.");
    }
});
router.post('/Register', function (req, res, next) {
    var usertest = new Usertest();
    usertest.username = req.body.username;
    usertest.email = req.body.email;
    usertest.setPassword(req.body.password);
    usertest.save(function (err, user) {
        if (err)
            return next(err);
        res.send("Registration Complete. Please login.");
    });
});
router.post('/Login/Local', function (req, res, next) {
    if (!req.body.username || !req.body.password)
        return res.status(400).send("Please fill out every field");
    passport.authenticate('local', function (err, user, info) {
        console.log(user);
        if (err)
            return next(err);
        if (user)
            return res.json({ token: user.generateJWT() });
        return res.status(400).send(info);
    })(req, res, next);
});
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/#/account' }), function (req, res) {
    if (req.isAuthenticated()) {
        var token = { token: req.user.generateJWT() };
        console.log(token.token);
        res.redirect('/#/Token/' + token.token);
    }
    else {
        res.send("You are not authenticated.");
    }
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
