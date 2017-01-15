import mongoose = require('mongoose');
var User = mongoose.model('User');
var Question = mongoose.model('Question');
var Exam = mongoose.model('Exam');

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

module.exports.examBank = function(req, res) {

  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    // Otherwise continue
    let questArray = req.param('questArray');
    if (questArray){
      Question.find({_id:  { "$in" : questArray}}, function (err, questions) {
        res.json(questions);
      });
    } else {
      res.json("no questArray submitted");
    }
  }

};

module.exports.examUpdate = function(req, res, next) {
  // this will update the attempt at this sub exam
  // there will only be one attempt at a time
  // if you don't pick attempt it will erase the current attempt and start a new one

  console.log('hit examUpdate');
  console.log(`req: ${req}`);
  console.log(`req.payload.role: ${req.payload.role}`);
  console.log(`req.payload._id: ${req.payload._id}`);
  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    // Otherwise continue
    console.log(`req.body.examNum: ${req.body.examNum}`);
    var examNum = req.body.examNum;
    var subExamNum = req.body.subExamNum;
    var answered = req.body.answered;
    var answers = req.body.answers;
    var elapsedTime = req.body.elapsedTime;
    var studentAnswer = req.body.studentAnswer;
    var studentAnswerA = req.body.studentAnswerA;
    var studentAnswerB = req.body.studentAnswerB;
    var studentAnswerC = req.body.studentAnswerC;
    var studentAnswerD = req.body.studentAnswerD;
    var studentAnswerE = req.body.studentAnswerE;
    var needTwo = req.body.needTwo;
    console.log(`examNum: ${examNum}`);
    console.log(`subExamNum: ${subExamNum}`);
    console.log(`answered: ${answered}`);
    console.log(`answers: ${answers}`);
    console.log(`elapsedTime: ${elapsedTime}`);
    // console.log(`attemptNum: ${attemptNum}`);
    console.log(`studentAnswer: ${studentAnswer}`);
    console.log(`studentAnswerA: ${studentAnswerA}`);
    console.log(`studentAnswerB: ${studentAnswerB}`);
    console.log(`studentAnswerC: ${studentAnswerC}`);
    console.log(`studentAnswerD: ${studentAnswerD}`);
    console.log(`studentAnswerE: ${studentAnswerE}`);
    console.log(`needTwo: ${needTwo}`);
    User.findOne({_id: req.payload._id}, function(err, user){
      console.log(`user: ${JSON.stringify(user)}`);
      console.log(`examNum: ${examNum}`);
      console.log(`subExamNum: ${subExamNum}`);
      console.log(`answered: ${answered}`);
      console.log(`answers: ${answers}`);
      console.log(`elapsedTime: ${elapsedTime}`);
      // console.log(`attemptNum: ${attemptNum}`);
      console.log(`user['gradeArray'][examNum][subExamNum]: ${JSON.stringify(user['gradeArray'][examNum][subExamNum])}`);
      if(user['gradeArray'][examNum][subExamNum]['attempt']){
        console.log('already have a saved attempt for this sub exam');
        // update info
        user['gradeArray'][examNum][subExamNum]['attempt'] = {answered: answered, answers: answers, elapsedTime: elapsedTime, studentAnswer: studentAnswer, studentAnswerA: studentAnswerA, studentAnswerB: studentAnswerB, studentAnswerC: studentAnswerC, studentAnswerD: studentAnswerD, studentAnswerE: studentAnswerE, needTwo: needTwo, active: true};
        User.update({ _id: req.payload._id}, { $set: { gradeArray: user['gradeArray'] }}, function(err,user){
          if (err) return err;
          res.send('updated');
        });
      } else {
        console.log('new attempt for this subexam');
        user['gradeArray'][examNum][subExamNum]['attempt'] = {answered: answered, answers: answers,elapsedTime: elapsedTime, studentAnswer: studentAnswer, studentAnswerA: studentAnswerA, studentAnswerB: studentAnswerB, studentAnswerC: studentAnswerC, studentAnswerD: studentAnswerD, studentAnswerE: studentAnswerE, needTwo: needTwo, active: true};
        User.update({ _id: req.payload._id}, { $set: { gradeArray: user['gradeArray'] }}, function(err,user){
          if (err) return err;
          res.send('updated');
        });
      }
    });

  }

};

module.exports.gradeExam = function(req, res, next) {
  console.log('hit gradeExam');
  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    // Otherwise continue
    // will save all graded attempts and give you an average graded
    // will use this mainly on a display page for users and admin
    // feature for the future - analyze common missed questions so teacher can review for students

    var examNum = req.body.examNum;
    var subExamNum = req.body.subExamNum;
    var answered = req.body.answered;
    var answers = req.body.answers;
    var elapsedTime = req.body.elapsedTime;
    var finalGrade = req.body.finalGrade;
    var rightWrongArray = req.body.rightWrongArray;
    var studentAnswer = req.body.studentAnswer;
    var studentAnswerA = req.body.studentAnswerA;
    var studentAnswerB = req.body.studentAnswerB;
    var studentAnswerC = req.body.studentAnswerC;
    var studentAnswerD = req.body.studentAnswerD;
    var studentAnswerE = req.body.studentAnswerE;
    var needTwo = req.body.needTwo;
    console.log(`examNum: ${examNum}`);
    console.log(`subExamNum: ${subExamNum}`);
    console.log(`answered: ${answered}`);
    console.log(`answers: ${answers}`);
    console.log(`elapsedTime: ${elapsedTime}`);
    console.log(`finalGrade: ${finalGrade}`);
    console.log(`rightWrongArray: ${rightWrongArray}`);
    console.log(`studentAnswer: ${studentAnswer}`);
    console.log(`studentAnswerA: ${studentAnswerA}`);
    console.log(`studentAnswerB: ${studentAnswerB}`);
    console.log(`studentAnswerC: ${studentAnswerC}`);
    console.log(`studentAnswerD: ${studentAnswerD}`);
    console.log(`studentAnswerE: ${studentAnswerE}`);
    console.log(`needTwo: ${needTwo}`);
    let data = { answered: answered, answers: answers, elapsedTime: elapsedTime, finalGrade: finalGrade, rightWrongArray: rightWrongArray, studentAnswer: studentAnswer, studentAnswerA: studentAnswerA, studentAnswerB: studentAnswerB, studentAnswerC: studentAnswerC, studentAnswerD: studentAnswerD, studentAnswerE: studentAnswerE, needTwo: needTwo };
    console.log(`data: ${JSON.stringify(data)}`);
    User.findOne({_id: req.payload._id}, function(err, user){
      //push to submitted array
      user['gradeArray'][examNum][subExamNum]['submitted'].push(data);
      let gradeSum = 0;
      let len=user['gradeArray'][examNum][subExamNum]['submitted'].length;
      for(let i=0;i<len;i++){
        gradeSum+=parseInt(user['gradeArray'][examNum][subExamNum]['submitted'][i]['finalGrade']);
      }
      user['gradeArray'][examNum][subExamNum]['gradeAverage'] = Math.round(gradeSum/len);
      user['gradeArray'][examNum][subExamNum]['recentGrade']=parseInt(data['finalGrade']);
      User.update({ _id: req.payload._id}, { $set: { gradeArray: user['gradeArray'] }}, function(err,user){
        if (err) return err;
        res.send('grade submitted');
      });
    });

  }
};

module.exports.clone = function(req,res){
  let cloneData = req.body.clone;
  console.log(`Server cloneData: ${cloneData}`);
  Question.create(cloneData, function(err, data){
    res.json(data);
  })
}
