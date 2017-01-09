namespace MyApp.Controllers {

  export class MainController {
      public message;
      public title;

      constructor() {
        this.message = "Welcome to the Main page - enjoy your stay!";
        this.title = "Index Page";
      }

  }
  angular.module('MyApp').controller('MainController', MainController);

export class QuestionFormController {
      public questions;
      public counter;
      public examNum;
      public http;
      public message;
      public formShow;
      public initial;
      public moreMessage;
      public messageMin;
      public examName;
      public displayExamName;
      public displayExamNum;
      public accountService;

      enterExamNum(){
        let examNum = this.examNum;
        let self = this;
        this.http.get('/testBank', {
          params: {
            examNum: this.examNum
          },
          headers: {
            Authorization: 'Bearer '+ this.accountService.getToken()
          }
          }).then((response) => {
          console.log('response.data:');
          console.log(response.data);
          console.log(response.data.questions.length);
          if (response.data.questions.length) {
            self.message = "You have already entered questions for this exam number - please continue";
            this.formShow = true;
            this.initial = false;
            this.displayExamNum = this.examNum;
            this.examName = response.data.examName;
            this.displayExamName = response.data.examName||"Optional Exam Name";
            var target = angular.element(document).find('#questionTextarea');
            target[0].focus();
            target[0].select();
            self.counter = response.data.questions.length + 1;
          } else {
            self.message = "New Exam - start entering questions for the exam";
            this.formShow = true;
            var target = angular.element(document).find('#questionTextarea');
            target[0].focus();
            target[0].select();
            self.counter = 1;
          }
        });
      }

      selectTwoLimit(id){
        this.moreMessage = "";
        this.messageMin = "";
        var numCheck = 0;
        if(this.questions.correctAnswerA=="Y"){
          numCheck++;
        }
        if(this.questions.correctAnswerB=="Y"){
          numCheck++;
        }
        if(this.questions.correctAnswerC=="Y"){
          numCheck++;
        }
        if(this.questions.correctAnswerD=="Y"){
          numCheck++;
        }
        if(this.questions.correctAnswerE=="Y"){
          numCheck++;
        }
        if (numCheck>2){
          var target = angular.element(document.getElementById(id));
          console.log(`target: ${target}`);
          this.questions['correctAnswer'+id]="N";
          target[0].checked = false;
          this.moreMessage = "You can only pick two!";
        }
      }

      selectRad(){
        this.messageMin = "";
      }

      newQuestion(){
        console.log(this.http);
        let correctAnswer = [];
        let examNum = this.examNum;
        let examName = this.examName;
        let selectTwo = this.questions.selectTwo;
        let question = this.questions.question;
        let answerA = this.questions.answerA;
        let answerB = this.questions.answerB;
        let answerC = this.questions.answerC;
        let answerD = this.questions.answerD;
        let answerE = this.questions.answerE;
        if(selectTwo=="Y"){
          if(this.questions.correctAnswerA=="Y"){
            correctAnswer.push("A");
          }
          if(this.questions.correctAnswerB=="Y"){
            correctAnswer.push("B");
          }
          if(this.questions.correctAnswerC=="Y"){
            correctAnswer.push("C");
          }
          if(this.questions.correctAnswerD=="Y"){
            correctAnswer.push("D");
          }
          if(this.questions.correctAnswerE=="Y"){
            correctAnswer.push("E");
          }
          if(correctAnswer.length<2){
            this.messageMin = "You need to select two answers!";
            return false;
          }
        } else {
          if(this.questions.correctAnswer){
            correctAnswer.push(this.questions.correctAnswer);
          } else {
            this.messageMin = "You need to select an answer!";
            return false;
          }
        }

        console.log(`Exam Number: ${examNum}`);
        console.log(`Exam Name: ${examName}`);
        console.log(`Question: ${question}`);
        console.log(`answerA: ${answerA}`);
        console.log(`answerB: ${answerB}`);
        console.log(`answerC: ${answerC}`);
        console.log(`answerD: ${answerD}`);
        console.log(`answerE: ${answerE}`);
        console.log(`correctAnswer: ${correctAnswer}`);
        let data = {
             examNum: examNum,
             examName: examName,
             selectTwo: selectTwo,
             question: question,
             answerA: answerA,
             answerB: answerB,
             answerC: answerC,
             answerD: answerD,
             answerE: answerE,
             correctAnswer: correctAnswer,
             created_at: new Date()
        }
        console.log(data);
        this.initial = true;
        this.questions = {};
        this.moreMessage = "";
        this.messageMin = "";
        let self = this;

        this.http.post('/questionData', data,
          {
          headers: {
            Authorization: 'Bearer '+ this.accountService.getToken()
          }
          }).then((response) => {
            console.log(response.data);
            self.counter=response.data.questionNum;
            self.displayExamName=response.data.examName;
            self.message = "Successfully entered question into database";
        });

        }

      constructor(accountService: MyApp.Services.AccountService, public $state: ng.ui.IStateService, $http: ng.IHttpService, $stateParams){
        this.http = $http;
        var target = angular.element(document).find('#examNumInitial');
        target[0].focus();
        target[0].select();
        this.moreMessage = "";
        this.messageMin = "";
        this.accountService = accountService;
      }
  }

  angular.module("MyApp").controller('QuestionFormController', QuestionFormController);

  export class TestBankController {
      public questions;
      public http;
      public examNum;
      public examName;
      public message;
      public displayExamNum;
      public accountService;

      selectExamNum(){
        let self = this;
        this.http.get('/testBank', {
          params: {
            examNum: this.examNum
          },
          headers: {
            Authorization: 'Bearer '+ this.accountService.getToken()
          }
          }).then((response) => {
          console.log('response.data:');
          console.log(response.data);
          if (response.data){
            self.message = "";
            this.questions = response.data.questions;
            this.examName = response.data.examName;
            this.displayExamNum = this.examNum;
          } else {
            this.questions = "";
            self.message = "No matches found for that exam number";
          }
        });
      }

      constructor(accountService: MyApp.Services.AccountService, public $state: ng.ui.IStateService, $http: ng.IHttpService,$stateParams){
        this.http = $http;
        this.accountService = accountService;

      }
  }

  angular.module("MyApp").controller('TestBankController', TestBankController);

  export class TestArrayController {
      public questions;
      public http;
      public examNum;
      public message;

      selectExamNum(){
        let self = this;
        this.http.get('/testArray', {params: {examNum: this.examNum, testArray: ['581254bcdfcc1b35e52f7c96','581253e1dfcc1b35e52f7c94','58125412dfcc1b35e52f7c95']}}).then((response) => {
          console.log('response.data:');
          console.log(response.data);
          if (response.data.length){
            self.message = "";
            this.questions = response.data;
          } else {
            this.questions = "";
            self.message = "No matches found for that exam number";
          }
        });
      }

      constructor(public $state: ng.ui.IStateService, $http: ng.IHttpService,$stateParams){
        this.http = $http;

      }
  }

  angular.module("MyApp").controller('TestArrayController', TestArrayController);

  export class TestRandomizerController {
      public exams;
      public http;
      public examNum;
      public message;
      public username;
      public email;

      selectExamNum(){
        let self = this;
        this.http.get('/testRandomizer', {params: {examNum: this.examNum, username: this.username, email: this.email}}).then((response) => {
          console.log('response.data:');
          console.log(response.data);
          if (response.data){
            self.message = "";
            this.exams = response.data;
          } else {
            this.exams = "";
            self.message = "No matches found for that exam number";
          }
        });
      }

      constructor(public $state: ng.ui.IStateService, $http: ng.IHttpService,$stateParams){
        this.http = $http;
        this.username = localStorage.getItem('username');
        this.email = localStorage.getItem('email');
      }
  }

  angular.module("MyApp").controller('TestRandomizerController', TestRandomizerController);

  export class PracticeTestController {
      public questions;
      public submitted;
      public needTwo;
      public currentPage;
      public totalItems;
      public log;
      public examsAvailable;
      public student;
      public http;
      public examNum;
      public message;
      public test;
      public message2;
      public message3;
      public message4;
      public message5;
      public answers;
      public studentAnswer;
      public studentAnswerA;
      public studentAnswerB;
      public studentAnswerC;
      public studentAnswerD;
      public studentAnswerE;
      public moreMessage;
      public messageMin;
      public examSelect;
      public examNameSelect;
      public subexamSelect;
      public elapsedTime;
      public accountService;
      public answered;
      public attemptNum;

      pageChanged(){
        this.log.log('Page changed to: '+ this.currentPage);
        this.moreMessage = "";
        this.messageMin = "";
      }

      goToPage(num){
        this.currentPage = num;
      }

      selectExam(exam,subexam){
        this.examSelect = exam;
        this.subexamSelect = subexam;
        this.examNameSelect = this.student.examNames[exam];
        let self = this;
        this.http.get('/examBank', {
          params: {
            questArray: this.student.practiceTests[exam][subexam]
          },
          headers: {
            Authorization: 'Bearer '+ this.accountService.getToken()
          }
          }).then((response) => {
          if (response.data.length){
            this.totalItems = response.data.length;
            self.message = "Good Luck!";
            this.questions = response.data;
          } else {
            this.questions = "";
            self.message = "No matches found for that subexam number";
          }
        });
      }

      selectSaved(exam,subexam){
        console.log('clicked progress bar');
        console.log(`exam: ${exam}, subexam: ${subexam}`);
        this.examSelect = exam;
        this.subexamSelect = subexam;
        this.examNameSelect = this.student.examNames[exam];
        let self = this;
        this.http.get('/examBank', {
          params: {
            questArray: this.student.practiceTests[exam][subexam]
          },
          headers: {
            Authorization: 'Bearer '+ this.accountService.getToken()
          }
          }).then((response) => {
          if (response.data.length){
            this.totalItems = response.data.length;
            self.message = "Good Luck!";
            this.questions = response.data;
            var attempt = self.student.gradeArray[this.examSelect][this.subexamSelect]['attempt'];
            console.log(`attempt: ${JSON.stringify(attempt)}`);
            self.answers = attempt.answers;
            self.answered = attempt.answered;
            self.studentAnswer = attempt.studentAnswer;
            self.studentAnswerA = attempt.studentAnswerA;
            self.studentAnswerB = attempt.studentAnswerB;
            self.studentAnswerC = attempt.studentAnswerC;
            self.studentAnswerD = attempt.studentAnswerD;
            self.studentAnswerE = attempt.studentAnswerE;
            self.needTwo = attempt.needTwo;
            self.elapsedTime = attempt.elapsedTime;
          } else {
            this.questions = "";
            self.message = "No matches found for that subexam number";
          }
        });
      }

      enterAnswer1(questNum){
        // radio button one choice question
        console.log(`this.studentAnswer: ${this.studentAnswer}`);
        console.log(`this.answered: ${this.answered}`);
        let questArrayPos = parseInt(questNum);
        if(this.answers[questArrayPos]){
          console.log('already answered this question - do no increment');
        } else {
          this.answered ++
        }
        let tempAnswerArray = [];
        tempAnswerArray.push(this.studentAnswer[questArrayPos]);
        if (tempAnswerArray.length>0){
          this.answers[questArrayPos]=tempAnswerArray;
        }
      }

      enterAnswer2(questNum,id,letterSelected){
        // checkbox two choice question
        let questArrayPos = parseInt(questNum);
        this.moreMessage = "";
        this.messageMin = "";
        let numCheck = 0;
        let tempAnswerArray = [];
        if(this.studentAnswerA[questArrayPos]=="Y"){
          tempAnswerArray.push("A");
          numCheck++;
        }
        if(this.studentAnswerB[questArrayPos]=="Y"){
          tempAnswerArray.push("B");
          numCheck++;
        }
        if(this.studentAnswerC[questArrayPos]=="Y"){
          tempAnswerArray.push("C");
          numCheck++;
        }
        if(this.studentAnswerD[questArrayPos]=="Y"){
          tempAnswerArray.push("D");
          numCheck++;
        }
        if(this.studentAnswerE[questArrayPos]=="Y"){
          tempAnswerArray.push("E");
          numCheck++;
        }
        if (tempAnswerArray.length>2){
          var test = document.getElementsByClassName('selectTwoQuest');
          test[id].checked = false;
          switch(letterSelected) {
            case "A":
                this.studentAnswerA[questArrayPos]="N";
                break;
            case "B":
                this.studentAnswerB[questArrayPos]="N"
                break;
            case "C":
                this.studentAnswerC[questArrayPos]="N"
                break;
            case "D":
                this.studentAnswerD[questArrayPos]="N"
                break;
            case "E":
                this.studentAnswerE[questArrayPos]="N"
                break;
          }
          this.moreMessage = "You can only pick two!";
        } else if (tempAnswerArray.length==1){
          if(this.answers[questArrayPos]){
            console.log('already answered this question need to check if you had two selected');
            if(this.answers[questArrayPos].length == 2){
              this.answered --;
            }
          }
          this.answers[questArrayPos]=tempAnswerArray;
          this.messageMin = "You need to select two answers!";
          this.needTwo[questArrayPos]=true;
        } else if (tempAnswerArray.length==2){
          this.answered ++;
          this.answers[questArrayPos]=tempAnswerArray;
          this.messageMin = "";
          this.needTwo[questArrayPos] = false;
        } else {
          if(this.answers[questArrayPos]){
            console.log('already answered this question need to check if you had two selected');
            if(this.answers[questArrayPos].length == 2){
              this.answered --;
            }
          }
          this.answers[questArrayPos] = "";
          this.messageMin = "You need to select an answer!";
        }
      }

      submitExam(out){
        this.$scope.$broadcast('timer-stop');
        this.attemptNum = 0;
        let self = this;
        let unansweredArray = [];
        let gradeArray = [];
        let submitExamQuest = this.questions;
        for(let i=0;i<this.questions.length;i++){
          if(this.answers[i]){
            if(this.questions[i].selectTwo != "Y"){
              if(this.questions[i].correctAnswer[0]==this.answers[i][0]){
                gradeArray[i]="Right";
              } else {
                gradeArray[i]="Wrong";
              }
            } else {
              if(this.questions[i].correctAnswer[0]==this.answers[i][0]&&this.questions[i].correctAnswer[1]==this.answers[i][1]){
                gradeArray[i]="Right";
              } else {
                gradeArray[i]="Wrong";
              }
            }
          } else {
            gradeArray[i]="Unanswered - Wrong"
            unansweredArray.push(i+1);
          }
        }
        if(unansweredArray.length>0 && out!='outoftime'){
          let yn = confirm('You have not answered all the questions. Are you sure you want to submit?');
          if (yn==true){
            gradeExam();
          } else {
            self.$scope.$broadcast('timer-start');
          }
        } else {
          gradeExam();
        }
        function gradeExam(){
          if(unansweredArray.length>0){
            self.message2=`You didn't answer the following questions: ${unansweredArray}. Grading commencing....`;
          } else {
            self.message2 = "You answered all the questions. Grading commencing....";
          }
          let string = "";
          let numRight = 0;
          for(let j=0;j<submitExamQuest.length;j++){
            string+="Question #"+(j+1)+" is "+gradeArray[j]+"! ";
            if(gradeArray[j]=="Right"){
              numRight++
            }
          }
          self.submitted = true;
          let finalGrade = Math.round(numRight/submitExamQuest.length*100);
          self.message4 = `Your grade is ${finalGrade}%`;
          self.message3 = string;
          if(out=="outoftime"){
            self.message5 = "You ran out of time!";
            self.$scope.$apply();
          }

          console.log(`Exam Number: ${self.examSelect}`);
          console.log(`SubExam Number: ${self.subexamSelect}`);
          console.log(`Answered: ${self.answered}`);
          console.log(`Answers: ${self.answers}`);
          console.log(`ElapsedTime: ${self.elapsedTime}`);
          console.log(`FinalGrade: ${finalGrade}`);
          console.log(`RightWrongArray: ${gradeArray}`);
          console.log(`studentAnswer: ${self.studentAnswer}`);
          console.log(`studentAnswerA: ${self.studentAnswerA}`);
          console.log(`studentAnswerB: ${self.studentAnswerB}`);
          console.log(`studentAnswerC: ${self.studentAnswerC}`);
          console.log(`studentAnswerD: ${self.studentAnswerD}`);
          console.log(`studentAnswerE: ${self.studentAnswerE}`);
          console.log(`needTwo: ${self.needTwo}`);
          let data = {
               examNum: self.examSelect,
               subExamNum: self.subexamSelect,
               answered: self.answered,
               answers: self.answers,
               elapsedTime: self.elapsedTime,
               finalGrade: finalGrade,
               rightWrongArray: gradeArray,
               studentAnswer: self.studentAnswer,
               studentAnswerA: self.studentAnswerA,
               studentAnswerB: self.studentAnswerB,
               studentAnswerC: self.studentAnswerC,
               studentAnswerD: self.studentAnswerD,
               studentAnswerE: self.studentAnswerE,
               needTwo: self.needTwo,
               created_at: new Date()
          }
          console.log(`data: ${JSON.stringify(data)}`);

          self.http.post('/gradeExam', data,
            {
            headers: {
              Authorization: 'Bearer '+ self.accountService.getToken()
            }
            }).then((response) => {
              console.log(`response.data: ${response.data}`);

          });
        }
      }


      saveProgress(){
        let self = this;
        console.log(`Exam Number: ${self.examSelect}`);
        console.log(`SubExam Number: ${self.subexamSelect}`);
        console.log(`Answered: ${self.answered}`);
        console.log(`Answers: ${self.answers}`);
        console.log(`ElapsedTime: ${self.elapsedTime}`);
        console.log(`studentAnswer: ${self.studentAnswer}`);
        console.log(`studentAnswerA: ${self.studentAnswerA}`);
        console.log(`studentAnswerB: ${self.studentAnswerB}`);
        console.log(`studentAnswerC: ${self.studentAnswerC}`);
        console.log(`studentAnswerD: ${self.studentAnswerD}`);
        console.log(`studentAnswerE: ${self.studentAnswerE}`);
        console.log(`needTwo: ${self.needTwo}`);
        let data = {
             examNum: self.examSelect,
             subExamNum: self.subexamSelect,
             answered: self.answered,
             answers: self.answers,
             elapsedTime: self.elapsedTime,
             studentAnswer: self.studentAnswer,
             studentAnswerA: self.studentAnswerA,
             studentAnswerB: self.studentAnswerB,
             studentAnswerC: self.studentAnswerC,
             studentAnswerD: self.studentAnswerD,
             studentAnswerE: self.studentAnswerE,
             needTwo: self.needTwo,
             created_at: new Date()
        }
        console.log(`data: ${JSON.stringify(data)}`);

        self.http.post('/examUpdate', data,
          {
          headers: {
            Authorization: 'Bearer '+ self.accountService.getToken()
          }
          }).then((response) => {
            console.log(`response.data: ${response.data}`);

        });

      }

      constructor(accountService: MyApp.Services.AccountService, public $state: ng.ui.IStateService, $http: ng.IHttpService,$stateParams,$log, private $scope:ng.IScope, $rootScope: ng.IRootScopeService){
        $http.get('/profile', {
          headers: {
            Authorization: 'Bearer '+ accountService.getToken()
          }
        }).then((response) => {
            this.student = response.data;
            var avatar = this.student.avatar;
            if (avatar){
              this.student.avatar = this.student.avatar.substring(6,this.student.avatar.length);
              this.student.avatar = "https://s."+this.student.avatar+"?s=100&r=x&d=retro";
            }
            this.examsAvailable = this.student.examsAvailable;
            this.message = "";
          });
        this.message = "";
        this.moreMessage = "";
        this.messageMin = "";
        this.message5 = "";
        this.answered = 0;
        this.http = $http;
        this.currentPage = 1;
        this.log = $log;
        this.studentAnswer = [];
        this.studentAnswerA = [];
        this.studentAnswerB = [];
        this.studentAnswerC = [];
        this.studentAnswerD = [];
        this.studentAnswerE = [];
        this.answers = [];
        this.needTwo = [];
        this.submitted = false;
        this.accountService = accountService;
        this.elapsedTime = 50;
        this.$scope.$on('timer-tick', (event: ng.IAngularEvent, data: number) => {
            // console.log(`event.name = ${event.name}, timeoutId = ${data.timeoutId}, millis = ${data.millis}\n`);
            this.elapsedTime++
            // console.log(`this.elapsedTime: ${this.elapsedTime}`);
        });
      }
  }

  angular.module("MyApp").controller('PracticeTestController', PracticeTestController);

  export class GradeDisplayController {
    public student;
    public questions;

    constructor(accountService: MyApp.Services.AccountService, $http: ng.IHttpService) {
      let self = this;
      this.questions = {};
      $http.get('/profile', {
        headers: {
          Authorization: 'Bearer '+ accountService.getToken()
        }
      }).then((response) => {
        console.log(`response.data: ${response.data}`);
        console.log(`JSON.stringify(response.data): ${JSON.stringify(response.data)}`);
        self.student = response.data;
        console.log(`self.student: ${self.student}`);
        for(let exam in self.student.practiceTests){
          for(let subexam in self.student.practiceTests[exam]){
            console.log(`exam: ${exam} subexam: ${subexam}`);
            console.log(`self.student.practiceTests[exam][subexam]: ${self.student.practiceTests[exam][subexam]}`);
            var questArray = self.student.practiceTests[exam][subexam];
            $http.get('/examBank', {
              params: {
                questArray: questArray
              },
              headers: {
                Authorization: 'Bearer '+ accountService.getToken()
              }
              }).then((response) => {
              if (response.data.length){
                console.log(`exam: ${exam} subexam: ${subexam}`);
                console.log(`response.data: ${response.data}`);
                if(self.questions[exam]){
                  self.questions[exam][subexam] = response.data;
                  console.log(`self.questions[exam][subexam]: ${JSON.stringify(self.questions[exam][subexam])}`);
                } else {
                  self.questions[exam] = {};
                  self.questions[exam][subexam] = response.data;
                  console.log(`self.questions[exam][subexam]: ${JSON.stringify(self.questions[exam][subexam])}`);
                  console.log(`self.questions: ${JSON.stringify(self.questions)}`);
                }
                // tempObj[exam]={};
                // tempObj[exam][subexam] = response.data;
                // console.log(`tempObj[exam][subexam]: ${JSON.stringify(tempObj[exam][subexam])}`);
              } else {
                console.log('no response');
              }
            });
          }
        }
      });
    }
  }

  export class AdminController {
      public students;
      public http;
      public message;
      public examsAvailable;
      public accountService;

      assignExam(student,examNum,index) {
        console.log(`index: ${index}`);
        console.log(`this.students[index]: ${JSON.stringify(this.students[index])}`);
        let examName = this.examsAvailable[0].examNames[examNum];
        console.log(`examName: ${examName}`);
        this.http.get('/adminExamAssign', {
          params: {
            examNum: examNum,
            examName: examName,
            student: student
          },
          headers: {
            Authorization: 'Bearer '+ this.accountService.getToken()
          }
        }).then((response) => {
          this.message = 'success';
          console.log(`response.data: ${response.data}`);
          console.log(`JSON.stringify(response.data): ${JSON.stringify(response.data)}`);
          this.students[index]=response.data;
        });
      }

      constructor(accountService: MyApp.Services.AccountService, public $state: ng.ui.IStateService, $http: ng.IHttpService,$stateParams){
        $http.get('/adminAssign', {
          headers: {
            Authorization: 'Bearer '+ accountService.getToken()
          }
        }).then((response) => {
          console.log(`response.data: ${response.data}`);
          console.log(`JSON.stringify(response.data): ${JSON.stringify(response.data)}`);
            this.students = response.data['users'];
            console.log(`this.students: ${JSON.stringify(this.students)}`);
            // using map to alter all the avatars
            this.students = this.students.map(function(ava){
              if(ava.avatar){
                ava.avatar=ava.avatar.substring(6,ava.avatar.length);
                ava.avatar = "https://s."+ava.avatar+"?s=50&r=x&d=retro";
              }
              return ava;
            })
            this.examsAvailable = response.data['exams'];
            console.log(`this.examsAvailable: ${JSON.stringify(this.examsAvailable)}`);
          });
          this.accountService = accountService;
          this.http = $http;
        }
  }


  angular.module("MyApp").controller('AdminController', AdminController);

    export class BadgesController {
          public badges;
          public text;

          constructor($http: ng.IHttpService, $sce: ng.ISCEService){
              $http.get('/badgesData').then((response) => {
                  this.badges = response.data;
              });
              this.text = $sce.trustAsHtml('<h1>Cum Laude</h1><p>Student satisfied final GPA requirements of 95-100%</p>')
          }
      }

      angular.module("MyApp").controller('BadgesController', BadgesController);

    export class EditProfileController {

      }

      angular.module("MyApp").controller('EditProfileController', EditProfileController);

  export class TestController {
      public test;
      public message;
      public list;
      public text;
      public http;
      public tests;
      public totalItems;
      public currentPage;
      public itemsPerPage;
      public log;
      public maxSize;
      public bigTotalItems;
      public bigCurrentPage;
      public viewby;

      // submit(){
      //   this.list = "submited";
      //   // this.list.push(this.text);
      // }


      setItemsPerPage(num) {
        this.itemsPerPage = num;
        this.currentPage = 1; //reset to first page
      }

      newTest(){
        console.log(this.http);
        console.log(this.tests);
        let self = this.tests;
        this.message = "Submited";
        let name = this.test.name;
        let description = this.test.description;
        let awesomeness = this.test.awesomeness;
        console.log(`Name: ${name}`);
        console.log(`Description: ${description}`);
        console.log(`Awesomeness: ${awesomeness}`);
        let data = {
             name: name,
             description: description,
             awesomeness: awesomeness,
             created_at: new Date()
            }
        console.log(data);
        this.http.post("/newTest", data).success(function(data, status) {
            console.log(data);
            self.unshift(data);
            console.log(self);
            // this.tests.push(data);
        });

      }

      setPage(pageNo){
        this.currentPage = pageNo;
      }

      pageChanged(){
        this.log.log('Page changed to: '+ this.currentPage);
      }

      constructor($http: ng.IHttpService,$log){
        this.viewby = 10;
        this.totalItems = 64;
        this.currentPage = 4;
        this.maxSize = 5;
        this.itemsPerPage = 4;
        this.bigTotalItems = 175;
        this.bigCurrentPage = 1;
        this.http = $http;
        this.log = $log;
        let self = this;
        console.log($http);
          this.message = "This is the test form";
          $http.get('/testData').then((response) => {

              this.tests = response.data;
              self.totalItems = this.tests.length;

          });
      }
  }
  angular.module("MyApp").controller('TestController', TestController);


    export class TestDisplayController {

      public status;

      constructor($state,$stateParams){
        this.status = $stateParams.status;
      }

    }

    angular.module("MyApp").controller('TestDisplayController', TestDisplayController);


    export class LoginController {

      public state;
      public accountService;
      public user;
      public http;
      public message;

      loginUser(){
        console.log(`loginUser() this.accountService: ${this.accountService}`);
        this.message = "Submited";
        let email = this.user.email;
        let password = this.user.password;
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log(`loginUser() this.state: ${this.state}`);
        let data = {
             email: email,
             password: password,
             created_at: new Date()
            }
        console.log(`Data object: ${data}`);
        this.user.email = "";
        this.user.password = "";
        let self = this;
        let acct = this.accountService;
        console.log(`acct: ${acct}`);
        acct.login(data).then(function(){
          self.$uibModalInstance.close();
          self.state.go('StudentDisplay');
        }, function(err){
          alert(err);
        });

      }

      public close() {
        this.$uibModalInstance.close();
      }

      constructor(private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance, accountService: MyApp.Services.AccountService, $http: ng.IHttpService, $state: ng.ui.IStateProvider) {
        this.accountService = accountService;
        this.http = $http;
        this.state = $state;
        this.message = "This is the login form";
      }

    }

    angular.module('MyApp').controller('LoginController', LoginController);

    export class RegistrationController {
        public message;
        public http;
        public user;
        public state;
        public accountService;

        newUser(){
          console.log(`newUser() this.accountService: ${this.accountService}`);
          this.message = "Submited";
          let username = this.user.username;
          let email = this.user.email;
          let password = this.user.password;
          console.log(`Username: ${username}`);
          console.log(`Email: ${email}`);
          console.log(`Password: ${password}`);
          console.log(`newUser() this.state: ${this.state}`);
          let data = {
               username: username,
               email: email,
               password: password,
               created_at: new Date()
              }
          console.log(`Data object: ${data}`);
          this.user.username = "";
          this.user.password = "";
          this.user.email = "";
          let self = this.state;
          let acct = this.accountService;
          console.log(`acct: ${acct}`);
          acct.register(data).then(function(){
            self.go('StudentDisplay')}, function(err){
              alert(err);
          });

        }

        constructor($http: ng.IHttpService, accountService: MyApp.Services.AccountService,  $state: ng.ui.IStateProvider){
          this.http = $http;
          this.state = $state;
          this.accountService = accountService;
          let self = this;
          this.message = "This is the registration form";
        }
    }
    angular.module("MyApp").controller('RegistrationController', RegistrationController);

    export class StudentDisplayController {
        public message;
        public user;

        constructor(accountService: MyApp.Services.AccountService, $http: ng.IHttpService){
          this.message = "This is the student display controller";
          $http.get('/profile', {
            headers: {
              Authorization: 'Bearer '+ accountService.getToken()
            }
          }).then((response) => {
              this.user = response.data;
              console.log(`Student Display this.user: ${JSON.stringify(this.user)}`);
              if(this.user.avatar){
                this.user.avatar = this.user.avatar.substring(6,this.user.avatar.length);
                this.user.avatar = "https://s."+this.user.avatar+"?s=100&r=x&d=retro";
                console.log(`avatar: ${this.user.avatar}`);
              }
            });
        }
      }

      angular.module('MyApp').controller('StudentDisplayController', StudentDisplayController);

    export class AdminListController {
        public message;
        public users;

        constructor(accountService: MyApp.Services.AccountService, $http: ng.IHttpService){
          this.message = "This is the admin list controller";
          $http.get('/admin', {
            headers: {
              Authorization: 'Bearer '+ accountService.getToken()
            }
          }).then((response) => {
              this.users = response.data;
              console.log(`this.users: ${JSON.stringify(this.users)}`);
              // using map to alter all the avatars
              this.users = this.users.map(function(ava){
                if(ava.avatar){
                  ava.avatar=ava.avatar.substring(6,ava.avatar.length);
                  ava.avatar = "https://s."+ava.avatar+"?s=100&r=x&d=retro";
                }
                return ava;
              })
            });
        }
      }

      angular.module('MyApp').controller('AdminListController', AdminListController);

      export class ForgotController {
          public message;
          public http;
          public user;
          public state;
          public accountService;

          forgotPass(){
            console.log(`newUser() this.accountService: ${this.accountService}`);
            this.message = "Submited";
            let email = this.user.email;
            let password = this.user.password;
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
            console.log(`loginUser() this.state: ${this.state}`);
            let data = {
                 email: email
                }
            console.log(`Data object: ${data}`);
            this.user.email = "";
            let self = this;
            let acct = this.accountService;
            console.log(`acct: ${acct}`);
            acct.forgot(data).then(function(){
              console.log(`data: ${JSON.stringify(data)}`);
              var messContent = 'An e-mail has been sent to ' + data.email + ' with further instructions.';
              self.message = messContent;
              // self.state.go('Index');
            }, function(err){
              alert(JSON.stringify(err));
            });

          }

          constructor($http: ng.IHttpService, accountService: MyApp.Services.AccountService,  $state: ng.ui.IStateProvider){
            this.http = $http;
            this.state = $state;
            this.accountService = accountService;
            let self = this;
            this.message = "This is the forgot form";
          }
        }

        angular.module('MyApp').controller('ForgotController', ForgotController);

        export class ResetController {
          public message;
          public http;
          public token;
          public password;
          public state;
          public accountService;
          public confirm;

          updatePassword(){
            console.log(`updatePassword() this.accountService: ${this.accountService}`);
            this.message = "Submited";
            let password = this.password;
            let confirm = this.confirm;
            console.log(`this.token: ${JSON.stringify(this.token)}`);
            console.log(`Password: ${password}`);
            console.log(`Confirm: ${confirm}`);
            let data = {
                 password: password,
                 token: this.token['token']
                }
            console.log(`Data object: ${JSON.stringify(data)}`);
            this.password = "";
            this.confirm = "";
            let self = this;
            let acct = this.accountService;
            acct.reset(data).then(function(){
              console.log(`data: ${JSON.stringify(data)}`);
              self.message = "Password updated."
              // self.state.go('Login');
            }, function(err){
              alert(JSON.stringify(err));
            });

          }

          constructor($http: ng.IHttpService, accountService: MyApp.Services.AccountService,  $state: ng.ui.IStateProvider, $stateParams: ng.ui.IStateParamsService){
            this.http = $http;
            this.state = $state;
            this.token = $stateParams;
            this.accountService = accountService;
            let self = this;
            this.message = "This is the reset form";
          }
        }

        angular.module('MyApp').controller('ResetController', ResetController);


      export class NavigationController {

          public isLoggedIn;
          public currentUser;
          public acct;
          public state;
          public isAdmin;

          logout(){
            console.log('clicked the logout btn');
            let self = this.state;
            this.acct.logout();
            self.go('Index');
          }

          public showModal() {
              this.$uibModal.open({
                  templateUrl: '/templates/login.html',
                  controller: 'LoginController',
                  controllerAs: 'modal',
                  size: 'md'
              });
          }

          constructor(accountService: MyApp.Services.AccountService, $rootScope: ng.IRootScopeService, $state: ng.ui.IStateProvider, private $uibModal: angular.ui.bootstrap.IModalService){

            this.acct = accountService;
            this.state = $state;
            this.isLoggedIn = accountService.isLoggedIn();
            if(this.isLoggedIn){
              this.currentUser = accountService.currentUser();
              if(this.currentUser.avatar){
                this.currentUser.avatar = this.currentUser.avatar.substring(6,this.currentUser.avatar.length);
                this.currentUser.avatar = "https://s."+this.currentUser.avatar+"?s=30&r=x&d=retro";
                console.log(`avatar: ${this.currentUser.avatar}`);
              }
              this.isAdmin = accountService.isAdmin();
            }
            $rootScope.$on('navUpdate',()=>{
              console.log('navUpdated');
              this.isLoggedIn = accountService.isLoggedIn();
              console.log(`this.isLoggedIn: ${this.isLoggedIn}`);
              this.isAdmin = accountService.isAdmin();
              console.log(`this.isAdmin: ${this.isAdmin}`);
              if(this.isLoggedIn){
                this.currentUser = accountService.currentUser();
                if(this.currentUser.avatar){
                  this.currentUser.avatar = this.currentUser.avatar.substring(6,this.currentUser.avatar.length);
                  this.currentUser.avatar = "https://s."+this.currentUser.avatar+"?s=30&r=x&d=retro";
                  console.log(`avatar: ${this.currentUser.avatar}`);
                }
              }

            });
          }
        }

        angular.module('MyApp').controller('NavigationController', NavigationController);

}
