var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var MainController = (function () {
            function MainController($state, $uibModal, $http, accountService) {
                this.$state = $state;
                this.$uibModal = $uibModal;
                this.http = $http;
                this.message = "Welcome to the Main page - enjoy your stay!";
                this.title = "Index Page";
                this.username = localStorage.getItem('username');
                this.token = localStorage.getItem('token');
                this.accountService = accountService;
            }
            MainController.prototype.login = function () {
                return this.accountService.isLoggedIn();
            };
            MainController.prototype.logout = function () {
                this.accountService.logout();
            };
            MainController.prototype.search = function () {
                var _this = this;
                console.log('main.search() - searchInput: ', this.searchInput);
                if (this.searchInput) {
                    this.http.get('/search', { params: { search: this.searchInput } }).then(function (response) {
                        _this.students = response.data;
                        console.log(_this.students);
                        console.log(_this.students.length);
                    });
                }
                else {
                    this.students = "";
                }
            };
            MainController.prototype.showModal = function () {
                this.$uibModal.open({
                    templateUrl: '/templates/login.html',
                    controller: 'LoginController',
                    controllerAs: 'modal',
                    size: 'md'
                });
            };
            return MainController;
        }());
        Controllers.MainController = MainController;
        angular.module('MyApp').controller('MainController', MainController);
        var QuestionFormController = (function () {
            function QuestionFormController($state, $http, $stateParams) {
                this.$state = $state;
                this.http = $http;
                var target = angular.element(document).find('#examNumInitial');
                target[0].focus();
                target[0].select();
                this.moreMessage = "";
                this.messageMin = "";
            }
            QuestionFormController.prototype.enterExamNum = function () {
                var _this = this;
                var examNum = this.examNum;
                var self = this;
                this.http.get('/testBank', { params: { examNum: this.examNum } }).then(function (response) {
                    console.log('response.data:');
                    console.log(response.data);
                    console.log(response.data.questions.length);
                    if (response.data.questions.length) {
                        self.message = "You have already entered questions for this exam number - please continue";
                        _this.formShow = true;
                        _this.initial = false;
                        _this.displayExamNum = _this.examNum;
                        _this.examName = response.data.examName;
                        _this.displayExamName = response.data.examName || "Optional Exam Name";
                        var target = angular.element(document).find('#questionTextarea');
                        target[0].focus();
                        target[0].select();
                        self.counter = response.data.questions.length + 1;
                    }
                    else {
                        self.message = "New Exam - start entering questions for the exam";
                        _this.formShow = true;
                        var target = angular.element(document).find('#questionTextarea');
                        target[0].focus();
                        target[0].select();
                        self.counter = 1;
                    }
                });
            };
            QuestionFormController.prototype.selectTwoLimit = function (id) {
                this.moreMessage = "";
                this.messageMin = "";
                var numCheck = 0;
                if (this.questions.correctAnswerA == "Y") {
                    numCheck++;
                }
                if (this.questions.correctAnswerB == "Y") {
                    numCheck++;
                }
                if (this.questions.correctAnswerC == "Y") {
                    numCheck++;
                }
                if (this.questions.correctAnswerD == "Y") {
                    numCheck++;
                }
                if (this.questions.correctAnswerE == "Y") {
                    numCheck++;
                }
                if (numCheck > 2) {
                    var target = angular.element(document.getElementById(id));
                    console.log("target: " + target);
                    this.questions['correctAnswer' + id] = "N";
                    target[0].checked = false;
                    this.moreMessage = "You can only pick two!";
                }
            };
            QuestionFormController.prototype.selectRad = function () {
                this.messageMin = "";
            };
            QuestionFormController.prototype.newQuestion = function () {
                console.log(this.http);
                var correctAnswer = [];
                var examNum = this.examNum;
                var examName = this.examName;
                var selectTwo = this.questions.selectTwo;
                var question = this.questions.question;
                var answerA = this.questions.answerA;
                var answerB = this.questions.answerB;
                var answerC = this.questions.answerC;
                var answerD = this.questions.answerD;
                var answerE = this.questions.answerE;
                if (selectTwo == "Y") {
                    if (this.questions.correctAnswerA == "Y") {
                        correctAnswer.push("A");
                    }
                    if (this.questions.correctAnswerB == "Y") {
                        correctAnswer.push("B");
                    }
                    if (this.questions.correctAnswerC == "Y") {
                        correctAnswer.push("C");
                    }
                    if (this.questions.correctAnswerD == "Y") {
                        correctAnswer.push("D");
                    }
                    if (this.questions.correctAnswerE == "Y") {
                        correctAnswer.push("E");
                    }
                    if (correctAnswer.length < 2) {
                        this.messageMin = "You need to select two answers!";
                        return false;
                    }
                }
                else {
                    if (this.questions.correctAnswer) {
                        correctAnswer.push(this.questions.correctAnswer);
                    }
                    else {
                        this.messageMin = "You need to select an answer!";
                        return false;
                    }
                }
                console.log("Exam Number: " + examNum);
                console.log("Exam Name: " + examName);
                console.log("Question: " + question);
                console.log("answerA: " + answerA);
                console.log("answerB: " + answerB);
                console.log("answerC: " + answerC);
                console.log("answerD: " + answerD);
                console.log("answerE: " + answerE);
                console.log("correctAnswer: " + correctAnswer);
                var data = {
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
                };
                console.log(data);
                this.initial = true;
                this.questions = {};
                this.moreMessage = "";
                this.messageMin = "";
                var self = this;
                this.http.post("/questionData", data).success(function (data, status) {
                    console.log(data);
                    self.counter = data.questionNum;
                    self.displayExamName = data.examName;
                    self.message = "Successfully entered question into database";
                });
            };
            return QuestionFormController;
        }());
        Controllers.QuestionFormController = QuestionFormController;
        angular.module("MyApp").controller('QuestionFormController', QuestionFormController);
        var TestBankController = (function () {
            function TestBankController($state, $http, $stateParams) {
                this.$state = $state;
                this.http = $http;
            }
            TestBankController.prototype.selectExamNum = function () {
                var _this = this;
                var self = this;
                this.http.get('/testBank', { params: { examNum: this.examNum } }).then(function (response) {
                    console.log('response.data:');
                    console.log(response.data);
                    if (response.data) {
                        self.message = "";
                        _this.questions = response.data.questions;
                        _this.examName = response.data.examName;
                        _this.displayExamNum = _this.examNum;
                    }
                    else {
                        _this.questions = "";
                        self.message = "No matches found for that exam number";
                    }
                });
            };
            return TestBankController;
        }());
        Controllers.TestBankController = TestBankController;
        angular.module("MyApp").controller('TestBankController', TestBankController);
        var TestArrayController = (function () {
            function TestArrayController($state, $http, $stateParams) {
                this.$state = $state;
                this.http = $http;
            }
            TestArrayController.prototype.selectExamNum = function () {
                var _this = this;
                var self = this;
                this.http.get('/testArray', { params: { examNum: this.examNum, testArray: ['581254bcdfcc1b35e52f7c96', '581253e1dfcc1b35e52f7c94', '58125412dfcc1b35e52f7c95'] } }).then(function (response) {
                    console.log('response.data:');
                    console.log(response.data);
                    if (response.data.length) {
                        self.message = "";
                        _this.questions = response.data;
                    }
                    else {
                        _this.questions = "";
                        self.message = "No matches found for that exam number";
                    }
                });
            };
            return TestArrayController;
        }());
        Controllers.TestArrayController = TestArrayController;
        angular.module("MyApp").controller('TestArrayController', TestArrayController);
        var TestRandomizerController = (function () {
            function TestRandomizerController($state, $http, $stateParams) {
                this.$state = $state;
                this.http = $http;
                this.username = localStorage.getItem('username');
                this.email = localStorage.getItem('email');
            }
            TestRandomizerController.prototype.selectExamNum = function () {
                var _this = this;
                var self = this;
                this.http.get('/testRandomizer', { params: { examNum: this.examNum, username: this.username, email: this.email } }).then(function (response) {
                    console.log('response.data:');
                    console.log(response.data);
                    if (response.data) {
                        self.message = "";
                        _this.exams = response.data;
                    }
                    else {
                        _this.exams = "";
                        self.message = "No matches found for that exam number";
                    }
                });
            };
            return TestRandomizerController;
        }());
        Controllers.TestRandomizerController = TestRandomizerController;
        angular.module("MyApp").controller('TestRandomizerController', TestRandomizerController);
        var PracticeTestController = (function () {
            function PracticeTestController($state, $http, $stateParams, $log, $scope, $rootScope) {
                var _this = this;
                this.$state = $state;
                this.$scope = $scope;
                var email = localStorage.getItem('email');
                $http.get('/getStud', { params: { email: email } }).then(function (response) {
                    console.log('response.data:');
                    console.log(response.data);
                    _this.student = response.data;
                    _this.examsAvailable = _this.student.examsAvailable;
                    _this.message = "";
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
                this.$scope.$on('timer-tick', function (event, data) {
                    console.log("event.name = " + event.name + ", timeoutId = " + data.timeoutId + ", millis = " + data.millis + "\n");
                    _this.elapsedTime++;
                    console.log("this.elapsedTime: " + _this.elapsedTime);
                });
            }
            PracticeTestController.prototype.pageChanged = function () {
                this.log.log('Page changed to: ' + this.currentPage);
                this.moreMessage = "";
                this.messageMin = "";
            };
            PracticeTestController.prototype.goToPage = function (num) {
                this.currentPage = num;
            };
            PracticeTestController.prototype.selectExam = function (exam, subexam) {
                var _this = this;
                console.log('Exam: ', exam, ' Subexam: ', subexam);
                this.examSelect = exam;
                this.subexamSelect = subexam;
                this.examNameSelect = this.student.examNames[exam];
                var self = this;
                this.http.get('/examBank', { params: { questArray: this.student.practiceTests[exam][subexam] } }).then(function (response) {
                    console.log('response.data:');
                    console.log(response.data);
                    if (response.data.length) {
                        _this.totalItems = response.data.length;
                        self.message = "Good Luck!";
                        _this.questions = response.data;
                    }
                    else {
                        _this.questions = "";
                        self.message = "No matches found for that subexam number";
                    }
                });
            };
            PracticeTestController.prototype.selectExamNum = function () {
                var _this = this;
                var self = this;
                this.http.get('/testBank', { params: { examNum: this.examNum } }).then(function (response) {
                    console.log('response.data:');
                    console.log(response.data);
                    if (response.data.length) {
                        self.message = "Good Luck!";
                        _this.questions = response.data;
                    }
                    else {
                        _this.questions = "";
                        self.message = "No matches found for that exam number";
                    }
                });
            };
            PracticeTestController.prototype.enterAnswer1 = function (questNum) {
                console.log("questNum: " + questNum);
                var questArrayPos = parseInt(questNum);
                console.log("questArrayPos: " + questArrayPos);
                var tempAnswerArray = [];
                tempAnswerArray.push(this.studentAnswer[questArrayPos]);
                if (tempAnswerArray.length > 0) {
                    this.answers[questArrayPos] = tempAnswerArray;
                    console.log(this.answers);
                }
            };
            PracticeTestController.prototype.enterAnswer2 = function (questNum, id, letterSelected) {
                console.log("this.studentAnswerA[questArrayPos]: " + this.studentAnswerA[questArrayPos]);
                console.log("questNum: " + questNum);
                var questArrayPos = parseInt(questNum);
                console.log("questArrayPos: " + questArrayPos);
                console.log("id: " + id);
                console.log("this.studentAnswerA[questArrayPos]: " + this.studentAnswerA[questArrayPos]);
                console.log("this.studentAnswerB[questArrayPos]: " + this.studentAnswerB[questArrayPos]);
                console.log("this.studentAnswerC[questArrayPos]: " + this.studentAnswerC[questArrayPos]);
                console.log("this.studentAnswerD[questArrayPos]: " + this.studentAnswerD[questArrayPos]);
                console.log("this.studentAnswerE[questArrayPos]: " + this.studentAnswerE[questArrayPos]);
                this.moreMessage = "";
                this.messageMin = "";
                var numCheck = 0;
                var tempAnswerArray = [];
                if (this.studentAnswerA[questArrayPos] == "Y") {
                    tempAnswerArray.push("A");
                    numCheck++;
                }
                if (this.studentAnswerB[questArrayPos] == "Y") {
                    tempAnswerArray.push("B");
                    numCheck++;
                }
                if (this.studentAnswerC[questArrayPos] == "Y") {
                    tempAnswerArray.push("C");
                    numCheck++;
                }
                if (this.studentAnswerD[questArrayPos] == "Y") {
                    tempAnswerArray.push("D");
                    numCheck++;
                }
                if (this.studentAnswerE[questArrayPos] == "Y") {
                    tempAnswerArray.push("E");
                    numCheck++;
                }
                console.log("numCheck: " + numCheck);
                console.log("tempAnswerArray.length: " + tempAnswerArray.length);
                if (tempAnswerArray.length > 2) {
                    var test = document.getElementsByClassName('selectTwoQuest');
                    console.log("test: " + test[id].checked);
                    test[id].checked = false;
                    switch (letterSelected) {
                        case "A":
                            this.studentAnswerA[questArrayPos] = "N";
                            break;
                        case "B":
                            this.studentAnswerB[questArrayPos] = "N";
                            break;
                        case "C":
                            this.studentAnswerC[questArrayPos] = "N";
                            break;
                        case "D":
                            this.studentAnswerD[questArrayPos] = "N";
                            break;
                        case "E":
                            this.studentAnswerE[questArrayPos] = "N";
                            break;
                    }
                    this.moreMessage = "You can only pick two!";
                }
                else if (tempAnswerArray.length == 1) {
                    this.answers[questArrayPos] = tempAnswerArray;
                    this.messageMin = "You need to select two answers!";
                    this.needTwo[questArrayPos] = true;
                    console.log(this.answers);
                }
                else if (tempAnswerArray.length == 2) {
                    this.answers[questArrayPos] = tempAnswerArray;
                    this.messageMin = "";
                    this.needTwo[questArrayPos] = false;
                    console.log(this.answers);
                }
                else {
                    this.answers[questArrayPos] = "";
                    this.messageMin = "You need to select an answer!";
                }
            };
            PracticeTestController.prototype.submitExam = function (out) {
                this.$scope.$broadcast('timer-stop');
                console.log('exam submitted');
                var self = this;
                var unansweredArray = [];
                var gradeArray = [];
                var submitExamQuest = this.questions;
                console.log(this.answers);
                console.log(this.answers.length);
                for (var i = 0; i < this.questions.length; i++) {
                    if (this.answers[i]) {
                        console.log(this.answers[i]);
                        if (this.questions[i].selectTwo != "Y") {
                            if (this.questions[i].correctAnswer[0] == this.answers[i][0]) {
                                console.log("You got question #" + (i + 1) + " right!");
                                gradeArray[i] = "Right";
                            }
                            else {
                                console.log("You got question #" + (i + 1) + " wrong!");
                                gradeArray[i] = "Wrong";
                            }
                        }
                        else {
                            if (this.questions[i].correctAnswer[0] == this.answers[i][0] && this.questions[i].correctAnswer[1] == this.answers[i][1]) {
                                console.log("You got question #" + (i + 1) + " right!");
                                gradeArray[i] = "Right";
                            }
                            else {
                                console.log("You got question #" + (i + 1) + " wrong!");
                                gradeArray[i] = "Wrong";
                            }
                        }
                    }
                    else {
                        gradeArray[i] = "Unanswered - Wrong";
                        unansweredArray.push(i + 1);
                    }
                }
                if (unansweredArray.length > 0 && out != 'outoftime') {
                    var yn = confirm('You have not answered all the questions. Are you sure you want to submit?');
                    console.log("yn: " + yn);
                    if (yn == true) {
                        console.log("yn - should be true: " + yn);
                        gradeExam();
                    }
                    else {
                        console.log("yn - should be false: " + yn);
                        self.$scope.$broadcast('timer-start');
                    }
                }
                else {
                    gradeExam();
                }
                function gradeExam() {
                    console.log('gradeExam() called');
                    console.log("gradeArray: " + gradeArray);
                    if (unansweredArray.length > 0) {
                        self.message2 = "You didn't answer the following questions: " + unansweredArray + ". Grading commencing....";
                    }
                    else {
                        self.message2 = "You answered all the questions. Grading commencing....";
                    }
                    var string = "";
                    var numRight = 0;
                    console.log(submitExamQuest.length);
                    for (var j = 0; j < submitExamQuest.length; j++) {
                        string += "Question #" + (j + 1) + " is " + gradeArray[j] + "! ";
                        if (gradeArray[j] == "Right") {
                            numRight++;
                        }
                    }
                    self.submitted = true;
                    var finalGrade = Math.round(numRight / submitExamQuest.length * 100);
                    console.log(finalGrade);
                    self.message4 = "Your grade is " + finalGrade + "%";
                    console.log(string);
                    self.message3 = string;
                    if (out == "outoftime") {
                        self.message5 = "You ran out of time!";
                        self.$scope.$apply();
                    }
                }
            };
            return PracticeTestController;
        }());
        Controllers.PracticeTestController = PracticeTestController;
        angular.module("MyApp").controller('PracticeTestController', PracticeTestController);
        var AdminController = (function () {
            function AdminController($state, $http, $stateParams) {
                var _this = this;
                this.$state = $state;
                $http.get('/Admin').then(function (response) {
                    _this.students = response.data;
                    console.log("this.students: " + JSON.stringify(_this.students));
                    $http.get('/examsAvailable').then(function (response) {
                        _this.examsAvailable = response.data;
                        console.log("response.data: " + response.data);
                    });
                });
                this.http = $http;
            }
            AdminController.prototype.assignExam = function (student, examNum, index) {
                var _this = this;
                console.log("index: " + index);
                console.log("this.students[index]: " + this.students[index]);
                var examName = this.examsAvailable[0].examNames[examNum];
                this.http.get('/adminExamAssign', { params: { examNum: examNum, examName: examName, student: student } }).then(function (response) {
                    _this.message = 'success';
                    console.log("response.data: " + response.data);
                    console.log("JSON.stringify(response.data): " + JSON.stringify(response.data));
                    _this.students[index] = response.data;
                });
            };
            return AdminController;
        }());
        Controllers.AdminController = AdminController;
        angular.module("MyApp").controller('AdminController', AdminController);
        var BadgesController = (function () {
            function BadgesController($http, $sce) {
                var _this = this;
                $http.get('/badgesData').then(function (response) {
                    _this.badges = response.data;
                });
                this.text = $sce.trustAsHtml('<h1>Cum Laude</h1><p>Student satisfied final GPA requirements of 95-100%</p>');
            }
            return BadgesController;
        }());
        Controllers.BadgesController = BadgesController;
        angular.module("MyApp").controller('BadgesController', BadgesController);
        var EditProfileController = (function () {
            function EditProfileController() {
            }
            return EditProfileController;
        }());
        Controllers.EditProfileController = EditProfileController;
        angular.module("MyApp").controller('EditProfileController', EditProfileController);
        var TestController = (function () {
            function TestController($http, $log) {
                var _this = this;
                this.viewby = 10;
                this.totalItems = 64;
                this.currentPage = 4;
                this.maxSize = 5;
                this.itemsPerPage = 4;
                this.bigTotalItems = 175;
                this.bigCurrentPage = 1;
                this.http = $http;
                this.log = $log;
                var self = this;
                console.log($http);
                this.message = "This is the test form";
                $http.get('/testData').then(function (response) {
                    _this.tests = response.data;
                    self.totalItems = _this.tests.length;
                });
            }
            TestController.prototype.setItemsPerPage = function (num) {
                this.itemsPerPage = num;
                this.currentPage = 1;
            };
            TestController.prototype.newTest = function () {
                console.log(this.http);
                console.log(this.tests);
                var self = this.tests;
                this.message = "Submited";
                var name = this.test.name;
                var description = this.test.description;
                var awesomeness = this.test.awesomeness;
                console.log("Name: " + name);
                console.log("Description: " + description);
                console.log("Awesomeness: " + awesomeness);
                var data = {
                    name: name,
                    description: description,
                    awesomeness: awesomeness,
                    created_at: new Date()
                };
                console.log(data);
                this.http.post("/newTest", data).success(function (data, status) {
                    console.log(data);
                    self.unshift(data);
                    console.log(self);
                });
            };
            TestController.prototype.setPage = function (pageNo) {
                this.currentPage = pageNo;
            };
            TestController.prototype.pageChanged = function () {
                this.log.log('Page changed to: ' + this.currentPage);
            };
            return TestController;
        }());
        Controllers.TestController = TestController;
        angular.module("MyApp").controller('TestController', TestController);
        var TestDisplayController = (function () {
            function TestDisplayController($state, $stateParams) {
                this.status = $stateParams.status;
            }
            return TestDisplayController;
        }());
        Controllers.TestDisplayController = TestDisplayController;
        angular.module("MyApp").controller('TestDisplayController', TestDisplayController);
        var LoginController = (function () {
            function LoginController($uibModalInstance, accountService, $http) {
                this.$uibModalInstance = $uibModalInstance;
                this.accountService = accountService;
                this.http = $http;
            }
            LoginController.prototype.close = function () {
                this.$uibModalInstance.close();
            };
            LoginController.prototype.ok = function () {
                console.log(this.http);
                this.message = "Submited";
                var email = this.user.email;
                var password = this.user.password;
                console.log("Email: " + email);
                console.log("Password1: " + password);
                var data = {
                    email: email,
                    password: password,
                    created_at: new Date()
                };
                console.log(data);
                this.accountService.login(data);
                this.$uibModalInstance.close();
            };
            return LoginController;
        }());
        Controllers.LoginController = LoginController;
        angular.module('MyApp').controller('LoginController', LoginController);
        var RegistrationController = (function () {
            function RegistrationController($http, accountService, $state) {
                this.http = $http;
                this.state = $state;
                this.accountService = accountService;
                var self = this;
                this.message = "This is the registration form";
            }
            RegistrationController.prototype.newUser = function () {
                console.log("newUser() this.accountService: " + this.accountService);
                this.message = "Submited";
                var username = this.user.username;
                var email = this.user.email;
                var password = this.user.password;
                console.log("Username: " + username);
                console.log("Email: " + email);
                console.log("Password: " + password);
                console.log("newUser() this.state: " + this.state);
                var data = {
                    username: username,
                    email: email,
                    password: password,
                    status: 'student',
                    practiceTests: {},
                    created_at: new Date()
                };
                console.log("Data object: " + data);
                var self = this.state;
                var acct = this.accountService;
                console.log("acct: " + acct);
                this.http.post("/v1/api/Register", data).success(function (data, status) {
                    console.log(data);
                    console.log("Email: " + email);
                    console.log("Password1: " + password);
                    var data1 = {
                        email: email,
                        password: password,
                        created_at: new Date()
                    };
                    console.log(data1);
                    acct.login(data1);
                    self.go('Index');
                });
            };
            return RegistrationController;
        }());
        Controllers.RegistrationController = RegistrationController;
        angular.module("MyApp").controller('RegistrationController', RegistrationController);
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
