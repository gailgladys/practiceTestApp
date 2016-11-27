namespace MyApp.Controllers {

  export class MainController {
      public message;
      public title;
      public students;
      public searchInput;
      public http;
      public accountService;
      public username;
      public token;

      public login(){
        return this.accountService.isLoggedIn();
      }

      public logout(){
        this.accountService.logout();
      }

      search(){
        console.log('main.search() - searchInput: ',this.searchInput);
        if (this.searchInput){
          this.http.get('/search',{params: {search: this.searchInput}}).then((response) => {
              this.students = response.data;
              console.log(this.students);
              console.log(this.students.length);
          });
        } else {
          this.students = "";
        }
      }

      constructor(private $state: ng.ui.IStateService, private $uibModal: angular.ui.bootstrap.IModalService, $http: ng.IHttpService, accountService: MyApp.Services.AccountService) {
        this.http = $http;
        // $http.get('/studentData').then((response) => {
        //   this.students = response.data
        // });
        this.message = "Welcome to the Main page - enjoy your stay!";
        this.title = "Index Page";
        this.username = localStorage.getItem('username');
        this.token = localStorage.getItem('token');
        this.accountService = accountService;
      }

      public showModal() {
          this.$uibModal.open({
              templateUrl: '/templates/login.html',
              controller: 'LoginController',
              controllerAs: 'modal',
              size: 'md'
          });
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
      public answers;
      public studentAnswer;
      public studentAnswerA;
      public studentAnswerB;
      public studentAnswerC;
      public studentAnswerD;
      public studentAnswerE;
      public moreMessage;
      public messageMin;

      pageChanged(){
        this.log.log('Page changed to: '+ this.currentPage);
        this.moreMessage = "";
        this.messageMin = "";
      }

      goToPage(num){
        this.currentPage = num;
      }

      reset(){
        console.log("clicked");
        this.message = "";
        this.test = "test";
      }

      key($event){
        alert('hit key');
      }

      countdownZero(){
        alert('You are out of time!');
      }

      selectExam(exam,subexam){
        console.log('Exam: ',exam,' Subexam: ',subexam);
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

      submitExam(){
        console.log('exam submitted');
        let self = this;
        let unansweredArray = [];
        let gradeArray = [];
        let submitExamQuest = this.questions;
        console.log(this.answers);
        console.log(this.answers.length);
        for(let i=0;i<this.questions.length;i++){
          if(this.answers[i]){
            console.log(this.answers[i]);
            if(this.questions[i].selectTwo=="N"){
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
            unansweredArray.push(i+1);
          }
        }
        if(unansweredArray.length>0){
          self.message2=`You didn't answer the following questions: ${unansweredArray}`;
          let yn = confirm('Are you sure you want to submit?');
          if (yn==true){
            gradeExam();
          } else {
            return;
          }

        } else {
          gradeExam();
        }
        function gradeExam(){
          console.log('gradeExam() called');
          console.log(`gradeArray: ${gradeArray}`);
          self.message2 = "You answered all the questions. Grading commencing....";
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
          self.message4 = `Your final grade is ${finalGrade}%`;
          console.log(string);
          self.message3 = string;
        }
      }

      constructor(public $state: ng.ui.IStateService, $http: ng.IHttpService,$stateParams,$log){
        let email = localStorage.getItem('email');
        $http.get('/getStud', {params: {email:email}}).then((response) => {
          console.log('response.data:');
          console.log(response.data);
          this.student = response.data;
          this.examsAvailable = this.student.examsAvailable;
        });
        this.message = "";
        this.moreMessage = "";
        this.messageMin = "";
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
        this.http.get('/adminExamAssign', {params: {examNum: examNum, student: student}}).then((response) => {
          this.message = 'success';
          console.log(`response.data: ${response.data}`);
          console.log(`JSON.stringify(response.data): ${JSON.stringify(response.data)}`);
          this.students[index]=response.data;
        });
      }

      constructor(public $state: ng.ui.IStateService, $http: ng.IHttpService,$stateParams){
        $http.get('/Admin').then((response) => {
          this.students = response.data;
          console.log(`this.students: ${JSON.stringify(this.students)}`);
          $http.get('/examsAvailable').then((response) => {
            this.examsAvailable = response.data;
          });
        });
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


  export class jobPostController {
        public jobPosts;
        public jobPost;
        public message;
        public http;
        public totalItems;
        public currentPage;
        public log;
        public itemsPerPage;
        public newForm;
        public editForm;

        pageChanged(){
          this.log.log('Page changed to: '+ this.currentPage);
        }

        edit(id){
          this.newForm = false;
          this.editForm = true;

        }

        newJobPost(){
          console.log(this.http);
          console.log(this.jobPosts);

          let self = this.jobPosts;
          this.totalItems++;
          this.message = "Submited";
          let title = this.jobPost.title;
          let location = this.jobPost.location;
          let description = this.jobPost.description;
          console.log(`Title: ${title}`);
          console.log(`Location: ${location}`);
          console.log(`Description: ${description}`);
          let data = {
               jobTitle: title,
               jobLocation: location,
               jobDescription: description,
               created_at: new Date()
              }
          console.log(data);
          this.jobPost = {};
          this.http.post("/jobPost", data).success(function(data, status) {
              console.log(data);
              self.unshift(data);
              console.log(self);
          });

        }

        constructor($http: ng.IHttpService,$log){
            this.message = "Job Post Page";
            this.http = $http;
            this.log = $log;
            this.currentPage = 1;
            this.itemsPerPage = 2;
            this.editForm = false;
            this.newForm = true;

            $http.get('/jobPostData').then((response) => {

                this.jobPosts = response.data;
                this.totalItems = this.jobPosts.length;
            });

        }
    }

    angular.module("MyApp").controller('jobPostController', jobPostController);


    export class ActiveController {

      }

      angular.module("MyApp").controller('ActiveController', ActiveController);

    export class StudDisplayController {
        public studForm;
        public status;
        public students;

        constructor($http: ng.IHttpService, $state,$stateParams){
          this.studForm = false;
          this.status = $stateParams.status;
          $http.get('/studentData').then((response) => {
              this.students = response.data;
          });
        }
      }

      angular.module("MyApp").controller('StudDisplayController', StudDisplayController);


    export class RecentController {

        }

        angular.module("MyApp").controller('RecentController', RecentController);

    export class TestDisplayController {

      public status;

      constructor($state,$stateParams){
        this.status = $stateParams.status;
      }

    }

    angular.module("MyApp").controller('TestDisplayController', TestDisplayController);



    export class AboutBadgesController {

      public badges;

      constructor($http: ng.IHttpService){
          $http.get('/badgesData').then((response) => {
              this.badges = response.data;
          });
      }

    }

      angular.module("MyApp").controller('AboutBadgesController', AboutBadgesController);

    export class StudController {

        public badges;

        constructor($http: ng.IHttpService){
            $http.get('/badgesData').then((response) => {
                this.badges = response.data;
            });
        }

      }

        angular.module("MyApp").controller('StudController', StudController);

    export class ContactController {

      }

      angular.module("MyApp").controller('ContactController', ContactController);

    export class ShowController {

        }

        angular.module("MyApp").controller('ShowController', ShowController);

    export class employerViewController {
      public badges;
      public student;

      constructor($http: ng.IHttpService,$state,$stateParams){
          $http.get('/badgesData').then((response) => {
              this.badges = response.data;
          });
          $http.get('/studentShowData',{params: {id: $stateParams.id}}).then((response) => {
            console.log(response.data);
            this.student = response.data;
          });
      }
    }

    angular.module("MyApp").controller('employerViewController', employerViewController);

    export class LoginController {

      public accountService;
      public user;
      public http;
      public message;

      public close() {
        this.$uibModalInstance.close();
      }

      public ok() {
        console.log(this.http);
        this.message = "Submited";
        // let username = this.user.username;
        let email = this.user.email;
        let password = this.user.password;
        // console.log(`Username: ${username}`);
        console.log(`Email: ${email}`);
        console.log(`Password1: ${password}`);
        let data = {
            //  username: username,
             email: email,
             password: password,
             created_at: new Date()
            }
        console.log(data);
        // this.http.post("/loginCheck", data).success(function(data, status) {
        //     console.log(data);
        // });

        this.accountService.login(data);
        this.$uibModalInstance.close();
      }

      constructor(private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance, accountService: MyApp.Services.AccountService, $http: ng.IHttpService) {
        this.accountService = accountService;
        this.http = $http;
      }

    }

    angular.module('MyApp').controller('LoginController', LoginController);

    export class FoodController {
      badges: {};
      search: string;

      constructor($http: ng.IHttpService) {
        $http.get('/badgesData').then((response) => {
            this.badges = response.data;
        });
      }
    }
      angular.module("MyApp").controller('FoodController', FoodController);


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
                 status: 'student',
                 practiceTests: {},
                 created_at: new Date()
                }
            console.log(`Data object: ${data}`);
            let self = this.state;
            let acct = this.accountService;
            console.log(`acct: ${acct}`);
            this.http.post("/v1/api/Register", data).success(function(data,status){
              console.log(data);
              console.log(`Email: ${email}`);
              console.log(`Password1: ${password}`);
              let data1 = {
                   email: email,
                   password: password,
                   created_at: new Date()
                  }
              console.log(data1);
              acct.login(data1);
              self.go('Index');
            });

          }

          constructor($http: ng.IHttpService, accountService: MyApp.Services.AccountService,  $state: ng.ui.IStateProvider){
            this.http = $http;
            this.state = $state;
            this.accountService = accountService;
            let self = this;
            // console.log(`$http: ${$http}`);
            // console.log(`this.http: ${this.http}`);
            // console.log(`$state: ${$state}`);
            // console.log(`this.state: ${this.state}`);
            this.message = "This is the registration form";
          }
      }
      angular.module("MyApp").controller('RegistrationController', RegistrationController);

}
