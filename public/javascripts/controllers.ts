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

      enterExamNum(){
        let examNum = this.examNum;
        let self = this;
        this.http.get('/testBank', {params: {examNum: this.examNum}}).then((response) => {
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

        this.http.post("/questionData", data).success(function(data, status) {
            console.log(data);
            self.counter=data.questionNum;
            self.displayExamName=data.examName;
            self.message = "Successfully entered question into database";
        });

        }

      constructor(public $state: ng.ui.IStateService, $http: ng.IHttpService, $stateParams){
        this.http = $http;
        var target = angular.element(document).find('#examNumInitial');
        target[0].focus();
        target[0].select();
        this.moreMessage = "";
        this.messageMin = "";
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

      selectExamNum(){
        let self = this;
        this.http.get('/testBank', {params: {examNum: this.examNum}}).then((response) => {
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

      constructor(public $state: ng.ui.IStateService, $http: ng.IHttpService,$stateParams){
        this.http = $http;

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

      pageChanged(){
        this.log.log('Page changed to: '+ this.currentPage);
        this.moreMessage = "";
        this.messageMin = "";
      }

      goToPage(num){
        this.currentPage = num;
      }

      selectExam(exam,subexam){
        console.log('Exam: ',exam,' Subexam: ',subexam);
        this.examSelect = exam;
        this.subexamSelect = subexam;
        this.examNameSelect = this.student.examNames[exam];
        let self = this;
        this.http.get('/examBank', {params: {questArray: this.student.practiceTests[exam][subexam]}}).then((response) => {
          console.log('response.data:');
          console.log(response.data);
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

      selectExamNum(){
        let self = this;
        this.http.get('/testBank', {params: {examNum: this.examNum}}).then((response) => {
          console.log('response.data:');
          console.log(response.data);
          if (response.data.length){
            self.message = "Good Luck!";
            this.questions = response.data;
          } else {
            this.questions = "";
            self.message = "No matches found for that exam number";
          }
        });
      }

      enterAnswer1(questNum){
        // radio button one choice question
        console.log(`questNum: ${questNum}`);
        let questArrayPos = parseInt(questNum);
        console.log(`questArrayPos: ${questArrayPos}`);
        let tempAnswerArray = [];
        tempAnswerArray.push(this.studentAnswer[questArrayPos]);
        if (tempAnswerArray.length>0){
          this.answers[questArrayPos]=tempAnswerArray;
          console.log(this.answers);
        }
      }

      enterAnswer2(questNum,id,letterSelected){
        console.log(`this.studentAnswerA[questArrayPos]: ${this.studentAnswerA[questArrayPos]}`);
        // checkbox two choice question
        console.log(`questNum: ${questNum}`);
        let questArrayPos = parseInt(questNum);
        console.log(`questArrayPos: ${questArrayPos}`);
        console.log(`id: ${id}`);
        console.log(`this.studentAnswerA[questArrayPos]: ${this.studentAnswerA[questArrayPos]}`);
        console.log(`this.studentAnswerB[questArrayPos]: ${this.studentAnswerB[questArrayPos]}`);
        console.log(`this.studentAnswerC[questArrayPos]: ${this.studentAnswerC[questArrayPos]}`);
        console.log(`this.studentAnswerD[questArrayPos]: ${this.studentAnswerD[questArrayPos]}`);
        console.log(`this.studentAnswerE[questArrayPos]: ${this.studentAnswerE[questArrayPos]}`);
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
        console.log(`numCheck: ${numCheck}`);
        console.log(`tempAnswerArray.length: ${tempAnswerArray.length}`);
        if (tempAnswerArray.length>2){
          var test = document.getElementsByClassName('selectTwoQuest');
          console.log(`test: ${test[id].checked}`);
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
          this.answers[questArrayPos]=tempAnswerArray;
          this.messageMin = "You need to select two answers!";
          this.needTwo[questArrayPos]=true;
          console.log(this.answers);
        } else if (tempAnswerArray.length==2){
          this.answers[questArrayPos]=tempAnswerArray;
          this.messageMin = "";
          this.needTwo[questArrayPos] = false;
          console.log(this.answers);
        } else {
          this.answers[questArrayPos] = "";
          this.messageMin = "You need to select an answer!";
        }
      }

      submitExam(out){
        this.$scope.$broadcast('timer-stop');
        // this.$scope.$apply();
        console.log('exam submitted');
        // this.submitted = true;
        let self = this;
        // self.submitted = true;
        let unansweredArray = [];
        let gradeArray = [];
        let submitExamQuest = this.questions;
        console.log(this.answers);
        console.log(this.answers.length);
        for(let i=0;i<this.questions.length;i++){
          if(this.answers[i]){
            console.log(this.answers[i]);
            if(this.questions[i].selectTwo != "Y"){
              if(this.questions[i].correctAnswer[0]==this.answers[i][0]){
                console.log(`You got question #${i+1} right!`)
                gradeArray[i]="Right";
              } else {
                console.log(`You got question #${i+1} wrong!`)
                gradeArray[i]="Wrong";
              }
            } else {
              if(this.questions[i].correctAnswer[0]==this.answers[i][0]&&this.questions[i].correctAnswer[1]==this.answers[i][1]){
                console.log(`You got question #${i+1} right!`)
                gradeArray[i]="Right";
              } else {
                console.log(`You got question #${i+1} wrong!`)
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
          console.log(`yn: ${yn}`);
          if (yn==true){
            console.log(`yn - should be true: ${yn}`);
            gradeExam();
          } else {
            console.log(`yn - should be false: ${yn}`);
            self.$scope.$broadcast('timer-start');
          }
        } else {
          gradeExam();
        }
        function gradeExam(){
          console.log('gradeExam() called');
          console.log(`gradeArray: ${gradeArray}`);
          if(unansweredArray.length>0){
            self.message2=`You didn't answer the following questions: ${unansweredArray}. Grading commencing....`;
          } else {
            self.message2 = "You answered all the questions. Grading commencing....";
          }
          let string = "";
          let numRight = 0;
          console.log(submitExamQuest.length);
          for(let j=0;j<submitExamQuest.length;j++){
            string+="Question #"+(j+1)+" is "+gradeArray[j]+"! ";
            if(gradeArray[j]=="Right"){
              numRight++
            }
          }
          self.submitted = true;
          let finalGrade = Math.round(numRight/submitExamQuest.length*100);
          console.log(finalGrade);
          self.message4 = `Your grade is ${finalGrade}%`;
          console.log(string);
          self.message3 = string;
          if(out=="outoftime"){
            self.message5 = "You ran out of time!";
            self.$scope.$apply();
          }

        }
      }

      constructor(accountService: MyApp.Services.AccountService, public $state: ng.ui.IStateService, $http: ng.IHttpService,$stateParams,$log, private $scope:ng.IScope, $rootScope: ng.IRootScopeService){
        $http.get('/profile', {
          headers: {
            Authorization: 'Bearer '+ accountService.getToken()
          }
        }).then((response) => {
            this.student = response.data;
            console.log(`this.student: ${JSON.stringify(this.student)}`);
            var avatar = this.student.avatar;
            console.log(`avatar: ${avatar}`);
            this.student.avatar = this.student.avatar.substring(6,this.student.avatar.length);
            this.student.avatar = "https://s."+this.student.avatar+"?s=100&r=x&d=retro";
            console.log(`avatar: ${this.student.avatar}`);
            this.examsAvailable = this.student.examsAvailable;
            this.message = "";
          });
        this.message = "";
        this.moreMessage = "";
        this.messageMin = "";
        this.message5 = "";
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
        this.elapsedTime = 0;
        this.$scope.$on('timer-tick', (event: ng.IAngularEvent, data: number) => {
            console.log(`event.name = ${event.name}, timeoutId = ${data.timeoutId}, millis = ${data.millis}\n`);
            this.elapsedTime++
            console.log(`this.elapsedTime: ${this.elapsedTime}`);
        });
      }
  }

  angular.module("MyApp").controller('PracticeTestController', PracticeTestController);

  export class AdminController {
      public students;
      public http;
      public message;
      public examsAvailable;

      assignExam(student,examNum,index) {
        console.log(`index: ${index}`);
        console.log(`this.students[index]: ${this.students[index]}`);
        let examName = this.examsAvailable[0].examNames[examNum];
        this.http.get('/adminExamAssign', {params: {examNum: examNum, examName: examName, student: student}}).then((response) => {
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
        }
}

      //
      //   $http.get('/admin').then((response) => {
      //     this.students = response.data;
      //     console.log(`this.students: ${JSON.stringify(this.students)}`);
      //     $http.get('/examsAvailable').then((response) => {
      //       this.examsAvailable = response.data;
      //       console.log(`response.data: ${response.data}`);
      //     });
      //   });
      //   this.http = $http;
      // }


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
              if(this.isLoggedIn){
                this.currentUser = accountService.currentUser();
                if(this.currentUser.avatar){
                  this.currentUser.avatar = this.currentUser.avatar.substring(6,this.currentUser.avatar.length);
                  this.currentUser.avatar = "https://s."+this.currentUser.avatar+"?s=30&r=x&d=retro";
                  console.log(`avatar: ${this.currentUser.avatar}`);
                }
                this.isAdmin = accountService.isAdmin();
              }

            });
          }
        }

        angular.module('MyApp').controller('NavigationController', NavigationController);

}
