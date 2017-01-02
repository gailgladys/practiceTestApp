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

module.exports.adminExamAssign = function(req, res) {
  console.log('hit adminExamAssign');
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
    let examNum = req.param('examNum');
    console.log(`examNum: ${examNum}`);
    let examName = req.param('examName');
    console.log(`examName: ${examName}`);
    let studentStr = req.param('student');
    console.log(`studentStr: ${studentStr}`);
    let student = JSON.parse(studentStr);
    console.log(`student: ${student}`);
    if (examNum){
      Question.find({examNum: examNum}, function (err, questions) {
        // construct the sub exams
        let examObj = {};
        let displayObj = {};
        let counter = 0;
        let tempArray = [];
        let tempDBArray = [];
        let subExam = 1;
        let dis = {};
        let db = "";
        console.log('questions.length: ',questions.length);
        while(questions.length>0){
          console.log('subExam: ', subExam,' questions.length: ', questions.length,' tempArray.length: ',tempArray.length);
          if(tempArray.length<20){
            dis = questions.splice(Math.random()*questions.length,1)[0];
            console.log('questions.length: ', questions.length);
            db = dis['_id'].toString();
            tempArray.push(dis);
            console.log('tempArray.length: ', tempArray.length);
            // console.log('tempArray: ',tempArray);
            examObj[subExam]=tempDBArray;
            dis = {};
            tempDBArray.push(db);
            // console.log('tempDBArray: ',tempDBArray);
            displayObj[subExam]=tempArray;
            db = "";
          } else {
            tempArray = [];
            tempDBArray = [];
            subExam++
          }
        }
        console.log(`examArray: ${examObj}`);

        if (student){
          console.log(`student: ${student}`);
          console.log(`student_id: ${student._id}`);
          console.log(`examNum: ${examNum}`);
          console.log(`examName: ${examName}`);
          console.log(`student.status: ${student.status}`);
          if(student.practiceTests){
            student.practiceTests[examNum]=examObj;
          } else {
            student['practiceTests'] = {};
            student.practiceTests[examNum]=examObj;
          }
          console.log(`student.practiceTests[examNum]: ${student.practiceTests[examNum]}`);
          if(student.examNames){
            student.examNames[examNum]=examName;
          } else {
            student['examNames'] = {};
            student.examNames[examNum]=examName;
          }
          console.log(`student.examNames[examNum]: ${student.examNames[examNum]}`);
          if(student.examsAvailable.indexOf(examNum)==-1){
            student.examsAvailable.push(examNum);
            console.log(`student.examsAvailable: ${student.examsAvailable}`);
          }
          console.log(`student(modified): ${student}`);
          User.update({'_id':student._id}, {'practiceTests': student.practiceTests, 'examsAvailable': student.examsAvailable, 'examNames': student.examNames}, function(err, resp) {
            if (err) return err;
            console.log('edited practiceTest');
            console.log(`resp: ${JSON.stringify(resp)}`);
            console.log(`student: ${JSON.stringify(student)}`);
            res.status(200).json(student);
          });

        } else {
          res.json('failed to save');
        }
      });
    } else {
      res.json('please enter an exam number');
    }
  }

};

module.exports.testBank = function(req, res) {
  console.log('hit testBank');
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
    let examNum = req.param('examNum');
    console.log(examNum);
    if (examNum){
      Question.find({examNum: examNum}, function (err, questions) {
        console.log(`questions: ${questions}`);
        console.log(`questions.length: ${questions.length}`);
        console.log(`err: ${err}`);
        if(questions.length){
          Exam.findOne({}, function(err, exam){
            let examName = exam.examNames[examNum.toString()];
            res.status(200).json({questions:questions,examName:examName});
          });
        } else {
          console.log('no matches');
          res.status(200).json({questions:""});
        }
      });
    } else {
        res.json("no exam number entered");
      }
  }

};

module.exports.questionData = function(req, res, next) {
  console.log('hit questionData');
  console.log(`req: ${req}`);
  console.log(`req.payload.role: ${req.payload.role}`);
  console.log(`req.payload._id: ${req.payload._id}`);
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
    console.log(`req.body.examName: ${req.body.examName}`);
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
    console.log(`data: ${data}`);
    let question = new Question(data);
    console.log(`question: ${question}`);
    question.save(function (err, entry) {
        if (err) return next(err);
        console.log('Saved question');
        console.log(`entry: ${entry}`);
        Exam.findOne({}, function (err, doc){
          console.log(`Exam.findOne hit  - examName: ${examName}`);
          if(doc) {
            console.log('first if(doc): exam findOne returned something');
            console.log(`doc: ${doc}`);
            if(doc.examAvailable.indexOf(entry.examNum)==-1){
              console.log('second if(doc.examAvailable.indexOf(entry.examNum)==-1): this is a new exam number and will be added to exam available array');
              doc.examAvailable.push(entry.examNum);
              console.log(`new examAvailable: ${doc.examAvailable}`)
            }
            if (doc.examNames){
              console.log('third if(doc.examNames): exam names as a field exists');
              if(examName){
                console.log('fourth if(examName) the user entered something for the name field - maybe for first time or rename');
                console.log(`doc.examNames[entry.examNum]: ${doc.examNames[entry.examNum]}`);
                console.log(`examName: ${examName}`);
                doc.examNames[entry.examNum]=examName;
                console.log(`after set = to examName - doc.examNames[question.examNum]: ${doc.examNames[entry.examNum]}`);
              }
            } else {
                console.log('else - new name entry even if ""');
                doc.examNames = {};
                doc.examNames[question.examNum]=examName;
            }
            console.log('as long as doc returned - all paths lead here - to save exam')
            Exam.update({}, {'examNames': doc.examNames, 'examAvailable': doc.examAvailable}, function(err, exam) {
              if (err) return next(err);
              console.log('edited exam');
              console.log(`exam: ${JSON.stringify(exam)}`);
              Question.find({examNum: entry.examNum}, function (err, questions) {
                res.status(200).json({questionNum: questions.length+1, examName: examName});
              });
            });
          } else {
            let arr = [entry.examNum];
            let examNames = {};
            examNames[entry.examNum] = examName;
            let data = { examAvailable: arr, examNames: examNames};
            var exam = new Exam(data);
            exam.save(function (err, exam) {
                if (err)
                    return next(err);
                console.log('Saved exam');
                console.log(exam);
                Question.find({examNum: entry.examNum}, function (err, questions) {
                  res.status(200).json({questionNum: questions.length+1});
                });
          });
        }
      });
    });
  }

};
