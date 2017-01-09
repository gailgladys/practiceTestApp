"use strict";
var mongoose = require("mongoose");
var User = mongoose.model('User');
var Question = mongoose.model('Question');
var Exam = mongoose.model('Exam');
module.exports.adminRead = function (req, res) {
    console.log('hit adminRead');
    console.log("req: " + req);
    console.log("req.payload.role: " + req.payload.role);
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    }
    else if (req.payload.role != 'admin') {
        res.status(401).json({
            "message": "UnauthorizedError: not admin"
        });
    }
    else {
        User
            .find({})
            .exec(function (err, users) {
            res.status(200).json(users);
        });
    }
};
module.exports.adminAssign = function (req, res) {
    console.log('hit adminAssign');
    console.log("req: " + req);
    console.log("req.payload.role: " + req.payload.role);
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    }
    else if (req.payload.role != 'admin') {
        res.status(401).json({
            "message": "UnauthorizedError: not admin"
        });
    }
    else {
        User
            .find({})
            .exec(function (err, users) {
            Exam
                .find({})
                .exec(function (err, exams) {
                res.status(200).json({ users: users, exams: exams });
            });
        });
    }
};
module.exports.adminExamAssign = function (req, res) {
    console.log('hit adminExamAssign');
    console.log("req: " + req);
    console.log("req.payload.role: " + req.payload.role);
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    }
    else if (req.payload.role != 'admin') {
        res.status(401).json({
            "message": "UnauthorizedError: not admin"
        });
    }
    else {
        var examNum_1 = req.param('examNum');
        console.log("examNum: " + examNum_1);
        var examName_1 = req.param('examName');
        console.log("examName: " + examName_1);
        var studentStr = req.param('student');
        console.log("studentStr: " + studentStr);
        var student_1 = JSON.parse(studentStr);
        console.log("student: " + student_1);
        if (examNum_1) {
            Question.find({ examNum: examNum_1 }, function (err, questions) {
                var examObj = {};
                var displayObj = {};
                var subExamGradeObj = {};
                var counter = 0;
                var tempArray = [];
                var tempDBArray = [];
                var subExam = 1;
                var dis = {};
                var db = "";
                console.log('questions.length: ', questions.length);
                while (questions.length > 0) {
                    subExamGradeObj[subExam] = { attempt: { answered: 0, answers: [], elapsedTime: 0, studentAnswer: [], studentAnswerA: [], studentAnswerB: [], studentAnswerC: [], studentAnswerD: [], studentAnswerE: [], needTwo: [], active: false }, gradeAverage: 0, recentGrade: 0, submitted: [] };
                    console.log('subExam: ', subExam, ' questions.length: ', questions.length, ' tempArray.length: ', tempArray.length, ' subExamGradeObj: ', subExamGradeObj);
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
                if (student_1) {
                    console.log("student: " + student_1);
                    console.log("student_id: " + student_1._id);
                    console.log("examNum: " + examNum_1);
                    console.log("examName: " + examName_1);
                    console.log("student.status: " + student_1.status);
                    if (student_1.gradeArray) {
                        console.log('gradeArray exists on this student');
                    }
                    else {
                        console.log('gradeArray does not exist on this student, need to initialize');
                        student_1['gradeArray'] = {};
                    }
                    student_1['gradeArray'][examNum_1] = subExamGradeObj;
                    if (student_1.practiceTests) {
                        student_1.practiceTests[examNum_1] = examObj;
                    }
                    else {
                        student_1['practiceTests'] = {};
                        student_1.practiceTests[examNum_1] = examObj;
                    }
                    console.log("student.practiceTests[examNum]: " + student_1.practiceTests[examNum_1]);
                    if (student_1.examNames) {
                        student_1.examNames[examNum_1] = examName_1;
                    }
                    else {
                        student_1['examNames'] = {};
                        student_1.examNames[examNum_1] = examName_1;
                    }
                    console.log("student.examNames[examNum]: " + student_1.examNames[examNum_1]);
                    if (student_1.examsAvailable.indexOf(examNum_1) == -1) {
                        student_1.examsAvailable.push(examNum_1);
                        console.log("student.examsAvailable: " + student_1.examsAvailable);
                    }
                    console.log("student(modified): " + student_1);
                    User.update({ '_id': student_1._id }, { 'practiceTests': student_1.practiceTests, 'gradeArray': student_1.gradeArray, 'examsAvailable': student_1.examsAvailable, 'examNames': student_1.examNames }, function (err, resp) {
                        if (err)
                            return err;
                        console.log('edited practiceTest');
                        console.log("resp: " + JSON.stringify(resp));
                        console.log("student: " + JSON.stringify(student_1));
                        res.status(200).json(student_1);
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
    }
};
module.exports.testBank = function (req, res) {
    console.log('hit testBank');
    console.log("req: " + req);
    console.log("req.payload.role: " + req.payload.role);
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    }
    else if (req.payload.role != 'admin') {
        res.status(401).json({
            "message": "UnauthorizedError: not admin"
        });
    }
    else {
        var examNum_2 = req.param('examNum');
        console.log(examNum_2);
        if (examNum_2) {
            Question.find({ examNum: examNum_2 }, function (err, questions) {
                console.log("questions: " + questions);
                console.log("questions.length: " + questions.length);
                console.log("err: " + err);
                if (questions.length) {
                    Exam.findOne({}, function (err, exam) {
                        var examName = exam.examNames[examNum_2.toString()];
                        res.status(200).json({ questions: questions, examName: examName });
                    });
                }
                else {
                    console.log('no matches');
                    res.status(200).json({ questions: "" });
                }
            });
        }
        else {
            res.json("no exam number entered");
        }
    }
};
module.exports.questionData = function (req, res, next) {
    console.log('hit questionData');
    console.log("req: " + req);
    console.log("req.payload.role: " + req.payload.role);
    console.log("req.payload._id: " + req.payload._id);
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    }
    else if (req.payload.role != 'admin') {
        res.status(401).json({
            "message": "UnauthorizedError: not admin"
        });
    }
    else {
        console.log("req.body.examName: " + req.body.examName);
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
        console.log("data: " + data);
        var question_1 = new Question(data);
        console.log("question: " + question_1);
        question_1.save(function (err, entry) {
            if (err)
                return next(err);
            console.log('Saved question');
            console.log("entry: " + entry);
            Exam.findOne({}, function (err, doc) {
                console.log("Exam.findOne hit  - examName: " + examName);
                if (doc) {
                    console.log('first if(doc): exam findOne returned something');
                    console.log("doc: " + doc);
                    if (doc.examAvailable.indexOf(entry.examNum) == -1) {
                        console.log('second if(doc.examAvailable.indexOf(entry.examNum)==-1): this is a new exam number and will be added to exam available array');
                        doc.examAvailable.push(entry.examNum);
                        console.log("new examAvailable: " + doc.examAvailable);
                    }
                    if (doc.examNames) {
                        console.log('third if(doc.examNames): exam names as a field exists');
                        if (examName) {
                            console.log('fourth if(examName) the user entered something for the name field - maybe for first time or rename');
                            console.log("doc.examNames[entry.examNum]: " + doc.examNames[entry.examNum]);
                            console.log("examName: " + examName);
                            doc.examNames[entry.examNum] = examName;
                            console.log("after set = to examName - doc.examNames[question.examNum]: " + doc.examNames[entry.examNum]);
                        }
                    }
                    else {
                        console.log('else - new name entry even if ""');
                        doc.examNames = {};
                        doc.examNames[question_1.examNum] = examName;
                    }
                    console.log('as long as doc returned - all paths lead here - to save exam');
                    Exam.update({}, { 'examNames': doc.examNames, 'examAvailable': doc.examAvailable }, function (err, exam) {
                        if (err)
                            return next(err);
                        console.log('edited exam');
                        console.log("exam: " + JSON.stringify(exam));
                        Question.find({ examNum: entry.examNum }, function (err, questions) {
                            res.status(200).json({ questionNum: questions.length + 1, examName: examName });
                        });
                    });
                }
                else {
                    var arr = [entry.examNum];
                    var examNames = {};
                    examNames[entry.examNum] = examName;
                    var data_1 = { examAvailable: arr, examNames: examNames };
                    var exam = new Exam(data_1);
                    exam.save(function (err, exam) {
                        if (err)
                            return next(err);
                        console.log('Saved exam');
                        console.log(exam);
                        Question.find({ examNum: entry.examNum }, function (err, questions) {
                            res.status(200).json({ questionNum: questions.length + 1 });
                        });
                    });
                }
            });
        });
    }
};
