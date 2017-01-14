var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var MainController = (function () {
            function MainController() {
                this.message = "Welcome to the Main page - enjoy your stay!";
                this.title = "Index Page";
            }
            return MainController;
        }());
        Controllers.MainController = MainController;
        angular.module('MyApp').controller('MainController', MainController);
        var QuestionFormController = (function () {
            function QuestionFormController(accountService, $state, $http, $stateParams) {
                this.$state = $state;
                this.http = $http;
                var target = angular.element(document).find('#examNumInitial');
                target[0].focus();
                target[0].select();
                this.moreMessage = "";
                this.messageMin = "";
                this.accountService = accountService;
            }
            QuestionFormController.prototype.enterExamNum = function () {
                var _this = this;
                var examNum = this.examNum;
                var self = this;
                this.http.get('/testBank', {
                    params: {
                        examNum: this.examNum
                    },
                    headers: {
                        Authorization: 'Bearer ' + this.accountService.getToken()
                    }
                }).then(function (response) {
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
                this.http.post('/questionData', data, {
                    headers: {
                        Authorization: 'Bearer ' + this.accountService.getToken()
                    }
                }).then(function (response) {
                    console.log(response.data);
                    self.counter = response.data.questionNum;
                    self.displayExamName = response.data.examName;
                    self.message = "Successfully entered question into database";
                });
            };
            return QuestionFormController;
        }());
        Controllers.QuestionFormController = QuestionFormController;
        angular.module("MyApp").controller('QuestionFormController', QuestionFormController);
        var TestBankController = (function () {
            function TestBankController(accountService, $state, $http, $stateParams) {
                this.$state = $state;
                this.http = $http;
                this.accountService = accountService;
            }
            TestBankController.prototype.selectExamNum = function () {
                var _this = this;
                var self = this;
                this.http.get('/testBank', {
                    params: {
                        examNum: this.examNum
                    },
                    headers: {
                        Authorization: 'Bearer ' + this.accountService.getToken()
                    }
                }).then(function (response) {
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
            function PracticeTestController(accountService, $state, $http, $stateParams, $log, $scope, $rootScope) {
                var _this = this;
                this.$state = $state;
                this.$scope = $scope;
                $http.get('/profile', {
                    headers: {
                        Authorization: 'Bearer ' + accountService.getToken()
                    }
                }).then(function (response) {
                    _this.student = response.data;
                    var avatar = _this.student.avatar;
                    if (avatar) {
                        _this.student.avatar = _this.student.avatar.substring(6, _this.student.avatar.length);
                        _this.student.avatar = "https://s." + _this.student.avatar + "?s=100&r=x&d=retro";
                    }
                    _this.examsAvailable = _this.student.examsAvailable;
                    _this.message = "";
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
                this.$scope.$on('timer-tick', function (event, data) {
                    _this.elapsedTime++;
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
                this.examSelect = exam;
                this.subexamSelect = subexam;
                this.examNameSelect = this.student.examNames[exam];
                var self = this;
                this.http.get('/examBank', {
                    params: {
                        questArray: this.student.practiceTests[exam][subexam]
                    },
                    headers: {
                        Authorization: 'Bearer ' + this.accountService.getToken()
                    }
                }).then(function (response) {
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
            PracticeTestController.prototype.selectSaved = function (exam, subexam) {
                var _this = this;
                console.log('clicked progress bar');
                console.log("exam: " + exam + ", subexam: " + subexam);
                this.examSelect = exam;
                this.subexamSelect = subexam;
                this.examNameSelect = this.student.examNames[exam];
                var self = this;
                this.http.get('/examBank', {
                    params: {
                        questArray: this.student.practiceTests[exam][subexam]
                    },
                    headers: {
                        Authorization: 'Bearer ' + this.accountService.getToken()
                    }
                }).then(function (response) {
                    if (response.data.length) {
                        _this.totalItems = response.data.length;
                        self.message = "Good Luck!";
                        _this.questions = response.data;
                        var attempt = self.student.gradeArray[_this.examSelect][_this.subexamSelect]['attempt'];
                        console.log("attempt: " + JSON.stringify(attempt));
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
                    }
                    else {
                        _this.questions = "";
                        self.message = "No matches found for that subexam number";
                    }
                });
            };
            PracticeTestController.prototype.enterAnswer1 = function (questNum) {
                console.log("this.studentAnswer: " + this.studentAnswer);
                console.log("this.answered: " + this.answered);
                var questArrayPos = parseInt(questNum);
                if (this.answers[questArrayPos]) {
                    console.log('already answered this question - do no increment');
                }
                else {
                    this.answered++;
                }
                var tempAnswerArray = [];
                tempAnswerArray.push(this.studentAnswer[questArrayPos]);
                if (tempAnswerArray.length > 0) {
                    this.answers[questArrayPos] = tempAnswerArray;
                }
            };
            PracticeTestController.prototype.enterAnswer2 = function (questNum, id, letterSelected) {
                var questArrayPos = parseInt(questNum);
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
                if (tempAnswerArray.length > 2) {
                    var test = document.getElementsByClassName('selectTwoQuest');
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
                    if (this.answers[questArrayPos]) {
                        console.log('already answered this question need to check if you had two selected');
                        if (this.answers[questArrayPos].length == 2) {
                            this.answered--;
                        }
                    }
                    this.answers[questArrayPos] = tempAnswerArray;
                    this.messageMin = "You need to select two answers!";
                    this.needTwo[questArrayPos] = true;
                }
                else if (tempAnswerArray.length == 2) {
                    this.answered++;
                    this.answers[questArrayPos] = tempAnswerArray;
                    this.messageMin = "";
                    this.needTwo[questArrayPos] = false;
                }
                else {
                    if (this.answers[questArrayPos]) {
                        console.log('already answered this question need to check if you had two selected');
                        if (this.answers[questArrayPos].length == 2) {
                            this.answered--;
                        }
                    }
                    this.answers[questArrayPos] = "";
                    this.messageMin = "You need to select an answer!";
                }
            };
            PracticeTestController.prototype.submitExam = function (out) {
                this.$scope.$broadcast('timer-stop');
                this.attemptNum = 0;
                var self = this;
                var unansweredArray = [];
                var gradeArray = [];
                var submitExamQuest = this.questions;
                for (var i = 0; i < this.questions.length; i++) {
                    if (this.answers[i]) {
                        if (this.questions[i].selectTwo != "Y") {
                            if (this.questions[i].correctAnswer[0] == this.answers[i][0]) {
                                gradeArray[i] = "Right";
                            }
                            else {
                                gradeArray[i] = "Wrong";
                            }
                        }
                        else {
                            if (this.questions[i].correctAnswer[0] == this.answers[i][0] && this.questions[i].correctAnswer[1] == this.answers[i][1]) {
                                gradeArray[i] = "Right";
                            }
                            else {
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
                    if (yn == true) {
                        gradeExam();
                    }
                    else {
                        self.$scope.$broadcast('timer-start');
                    }
                }
                else {
                    gradeExam();
                }
                function gradeExam() {
                    if (unansweredArray.length > 0) {
                        self.message2 = "You didn't answer the following questions: " + unansweredArray + ". Grading commencing....";
                    }
                    else {
                        self.message2 = "You answered all the questions. Grading commencing....";
                    }
                    var string = "";
                    var numRight = 0;
                    for (var j = 0; j < submitExamQuest.length; j++) {
                        string += "Question #" + (j + 1) + " is " + gradeArray[j] + "! ";
                        if (gradeArray[j] == "Right") {
                            numRight++;
                        }
                    }
                    self.submitted = true;
                    var finalGrade = Math.round(numRight / submitExamQuest.length * 100);
                    self.message4 = "Your grade is " + finalGrade + "%";
                    self.message3 = string;
                    if (out == "outoftime") {
                        self.message5 = "You ran out of time!";
                        self.$scope.$apply();
                    }
                    console.log("Exam Number: " + self.examSelect);
                    console.log("SubExam Number: " + self.subexamSelect);
                    console.log("Answered: " + self.answered);
                    console.log("Answers: " + self.answers);
                    console.log("ElapsedTime: " + self.elapsedTime);
                    console.log("FinalGrade: " + finalGrade);
                    console.log("RightWrongArray: " + gradeArray);
                    console.log("studentAnswer: " + self.studentAnswer);
                    console.log("studentAnswerA: " + self.studentAnswerA);
                    console.log("studentAnswerB: " + self.studentAnswerB);
                    console.log("studentAnswerC: " + self.studentAnswerC);
                    console.log("studentAnswerD: " + self.studentAnswerD);
                    console.log("studentAnswerE: " + self.studentAnswerE);
                    console.log("needTwo: " + self.needTwo);
                    var data = {
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
                    };
                    console.log("data: " + JSON.stringify(data));
                    self.http.post('/gradeExam', data, {
                        headers: {
                            Authorization: 'Bearer ' + self.accountService.getToken()
                        }
                    }).then(function (response) {
                        console.log("response.data: " + response.data);
                    });
                }
            };
            PracticeTestController.prototype.saveProgress = function () {
                var self = this;
                console.log("Exam Number: " + self.examSelect);
                console.log("SubExam Number: " + self.subexamSelect);
                console.log("Answered: " + self.answered);
                console.log("Answers: " + self.answers);
                console.log("ElapsedTime: " + self.elapsedTime);
                console.log("studentAnswer: " + self.studentAnswer);
                console.log("studentAnswerA: " + self.studentAnswerA);
                console.log("studentAnswerB: " + self.studentAnswerB);
                console.log("studentAnswerC: " + self.studentAnswerC);
                console.log("studentAnswerD: " + self.studentAnswerD);
                console.log("studentAnswerE: " + self.studentAnswerE);
                console.log("needTwo: " + self.needTwo);
                var data = {
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
                };
                console.log("data: " + JSON.stringify(data));
                self.http.post('/examUpdate', data, {
                    headers: {
                        Authorization: 'Bearer ' + self.accountService.getToken()
                    }
                }).then(function (response) {
                    console.log("response.data: " + response.data);
                });
            };
            return PracticeTestController;
        }());
        Controllers.PracticeTestController = PracticeTestController;
        angular.module("MyApp").controller('PracticeTestController', PracticeTestController);
        var GradeDisplayController = (function () {
            function GradeDisplayController(accountService, $http) {
                var self = this;
                this.questions = {};
                $http.get('/profile', {
                    headers: {
                        Authorization: 'Bearer ' + accountService.getToken()
                    }
                }).then(function (response) {
                    console.log("response.data: " + response.data);
                    console.log("JSON.stringify(response.data): " + JSON.stringify(response.data));
                    self.student = response.data;
                    console.log("self.student: " + self.student);
                    var _loop_1 = function (exam) {
                        var _loop_2 = function (subexam) {
                            console.log("exam: " + exam + " subexam: " + subexam);
                            console.log("self.student.practiceTests[exam][subexam]: " + self.student.practiceTests[exam][subexam]);
                            questArray = self.student.practiceTests[exam][subexam];
                            $http.get('/examBank', {
                                params: {
                                    questArray: questArray
                                },
                                headers: {
                                    Authorization: 'Bearer ' + accountService.getToken()
                                }
                            }).then(function (response) {
                                if (response.data.length) {
                                    console.log("exam: " + exam + " subexam: " + subexam);
                                    console.log("response.data: " + response.data);
                                    if (self.questions[exam]) {
                                        self.questions[exam][subexam] = response.data;
                                        console.log("self.questions[exam][subexam]: " + JSON.stringify(self.questions[exam][subexam]));
                                    }
                                    else {
                                        self.questions[exam] = {};
                                        self.questions[exam][subexam] = response.data;
                                        console.log("self.questions[exam][subexam]: " + JSON.stringify(self.questions[exam][subexam]));
                                        console.log("self.questions: " + JSON.stringify(self.questions));
                                    }
                                }
                                else {
                                    console.log('no response');
                                }
                            });
                        };
                        for (var subexam in self.student.practiceTests[exam]) {
                            _loop_2(subexam);
                        }
                    };
                    var questArray;
                    for (var exam in self.student.practiceTests) {
                        _loop_1(exam);
                    }
                });
            }
            return GradeDisplayController;
        }());
        Controllers.GradeDisplayController = GradeDisplayController;
        var AdminGradeDisplayController = (function () {
            function AdminGradeDisplayController($uibModalInstance, accountService, $http, selectedStudent, examNum, subExamNum) {
                var _this = this;
                this.$uibModalInstance = $uibModalInstance;
                this.selectedStudent = selectedStudent;
                this.examNum = examNum;
                this.subExamNum = subExamNum;
                console.log('hitting AdminGradeDisplayController');
                console.log("selectedStudent: " + this.selectedStudent);
                console.log("examNum: " + this.examNum);
                console.log("subExamNum: " + this.subExamNum);
                this.student = this.selectedStudent;
                this.submitted = this.student['gradeArray'][this.examNum][this.subExamNum]['submitted'];
                this.questions = {};
                var self = this;
                var questArray = self.student.practiceTests[this.examNum][this.subExamNum];
                $http.get('/examBank', {
                    params: {
                        questArray: questArray
                    },
                    headers: {
                        Authorization: 'Bearer ' + accountService.getToken()
                    }
                }).then(function (response) {
                    if (response.data.length) {
                        console.log("exam: " + _this.examNum + " subexam: " + _this.subExamNum);
                        console.log("response.data: " + response.data);
                        if (self.questions[_this.examNum]) {
                            self.questions[_this.examNum][_this.subExamNum] = response.data;
                            console.log("self.questions[this.examNum][this.subExamNum]: " + JSON.stringify(self.questions[_this.examNum][_this.subExamNum]));
                        }
                        else {
                            self.questions[_this.examNum] = {};
                            self.questions[_this.examNum][_this.subExamNum] = response.data;
                            console.log("self.questions[this.examNum][this.subExamNum]: " + JSON.stringify(self.questions[_this.examNum][_this.subExamNum]));
                            console.log("self.questions: " + JSON.stringify(self.questions));
                        }
                    }
                    else {
                        console.log('no response');
                    }
                });
            }
            AdminGradeDisplayController.prototype.close = function () {
                this.$uibModalInstance.close();
            };
            return AdminGradeDisplayController;
        }());
        Controllers.AdminGradeDisplayController = AdminGradeDisplayController;
        angular.module("MyApp").controller('AdminGradeDisplayController', AdminGradeDisplayController);
        var AdminController = (function () {
            function AdminController(accountService, $state, $http, $stateParams, $uibModal) {
                var _this = this;
                this.$state = $state;
                this.$uibModal = $uibModal;
                this.keys = Object.keys;
                $http.get('/adminAssign', {
                    headers: {
                        Authorization: 'Bearer ' + accountService.getToken()
                    }
                }).then(function (response) {
                    console.log("response.data: " + response.data);
                    console.log("JSON.stringify(response.data): " + JSON.stringify(response.data));
                    _this.students = response.data['users'];
                    console.log("this.students: " + JSON.stringify(_this.students));
                    _this.students = _this.students.map(function (ava) {
                        if (ava.avatar) {
                            ava.avatar = ava.avatar.substring(6, ava.avatar.length);
                            ava.avatar = "https://s." + ava.avatar + "?s=50&r=x&d=retro";
                        }
                        return ava;
                    });
                    _this.examsAvailable = response.data['exams'];
                    console.log("this.examsAvailable: " + JSON.stringify(_this.examsAvailable));
                });
                this.accountService = accountService;
                this.http = $http;
            }
            AdminController.prototype.showModal = function (student, examNum, subExamNum) {
                console.log("student: " + JSON.stringify(student));
                console.log("examNum: " + examNum);
                console.log("subExamNum: " + subExamNum);
                this.$uibModal.open({
                    templateUrl: '/templates/adminGradeDisplay.html',
                    controller: 'AdminGradeDisplayController',
                    controllerAs: 'modal',
                    resolve: {
                        selectedStudent: function () { return student; },
                        examNum: function () { return examNum; },
                        subExamNum: function () { return subExamNum; }
                    },
                    size: 'lg'
                });
            };
            AdminController.prototype.assignExam = function (student, examNum, index) {
                var _this = this;
                console.log("index: " + index);
                console.log("this.students[index]: " + JSON.stringify(this.students[index]));
                var examName = this.examsAvailable[0].examNames[examNum];
                console.log("examName: " + examName);
                this.http.get('/adminExamAssign', {
                    params: {
                        examNum: examNum,
                        examName: examName,
                        student: student
                    },
                    headers: {
                        Authorization: 'Bearer ' + this.accountService.getToken()
                    }
                }).then(function (response) {
                    _this.message = 'success';
                    console.log("response.data: " + response.data);
                    console.log("JSON.stringify(response.data): " + JSON.stringify(response.data));
                    _this.students[index] = response.data;
                });
            };
            AdminController.prototype.deleteExam = function (examNum, studentIndex) {
                console.log("examNum: " + examNum);
                console.log("studentIndex: " + studentIndex);
                console.log("student[studentIndex]: " + JSON.stringify(this.students[studentIndex]));
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
        var LoginController = (function () {
            function LoginController($uibModalInstance, accountService, $http, $state) {
                this.$uibModalInstance = $uibModalInstance;
                this.accountService = accountService;
                this.http = $http;
                this.state = $state;
                this.message = "";
                this.message1 = "";
                this.message2 = "";
            }
            LoginController.prototype.loginUser = function () {
                console.log("loginUser() this.accountService: " + this.accountService);
                var email = this.user.email;
                var password = this.user.password;
                console.log("Email: " + email);
                console.log("Password: " + password);
                console.log("loginUser() this.state: " + this.state);
                var data = {
                    email: email,
                    password: password,
                    created_at: new Date()
                };
                console.log("Data object: " + data);
                var self = this;
                var acct = this.accountService;
                console.log("acct: " + acct);
                acct.login(data).then(function () {
                    self.user.email = "";
                    self.user.password = "";
                    self.$uibModalInstance.close();
                    self.state.go('StudentDisplay');
                }, function (err) {
                    console.log("err: " + JSON.stringify(err));
                    console.log("err.data.message: " + err.data.message);
                    if (err.data.message == 'User not found') {
                        self.user.email = "";
                        self.message1 = err.data.message;
                        self.message2 = "";
                        self.message = "";
                    }
                    else if (err.data.message == "Password is wrong") {
                        self.user.password = "";
                        self.message2 = err.data.message;
                        self.message1 = "";
                        self.message = "";
                    }
                    else {
                        self.user.email = "";
                        self.user.password = "";
                        self.message = err.data.message;
                        self.message1 = "";
                        self.message2 = "";
                    }
                });
            };
            LoginController.prototype.close = function () {
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
                    created_at: new Date()
                };
                console.log("Data object: " + data);
                this.user.username = "";
                this.user.password = "";
                this.user.email = "";
                var self = this.state;
                var acct = this.accountService;
                console.log("acct: " + acct);
                acct.register(data).then(function () {
                    self.go('StudentDisplay');
                }, function (err) {
                    alert(err);
                });
            };
            return RegistrationController;
        }());
        Controllers.RegistrationController = RegistrationController;
        angular.module("MyApp").controller('RegistrationController', RegistrationController);
        var StudentDisplayController = (function () {
            function StudentDisplayController(accountService, $http) {
                var _this = this;
                this.message = "This is the student display controller";
                $http.get('/profile', {
                    headers: {
                        Authorization: 'Bearer ' + accountService.getToken()
                    }
                }).then(function (response) {
                    _this.user = response.data;
                    console.log("Student Display this.user: " + JSON.stringify(_this.user));
                    if (_this.user.avatar) {
                        _this.user.avatar = _this.user.avatar.substring(6, _this.user.avatar.length);
                        _this.user.avatar = "https://s." + _this.user.avatar + "?s=100&r=x&d=retro";
                        console.log("avatar: " + _this.user.avatar);
                    }
                });
            }
            return StudentDisplayController;
        }());
        Controllers.StudentDisplayController = StudentDisplayController;
        angular.module('MyApp').controller('StudentDisplayController', StudentDisplayController);
        var AdminListController = (function () {
            function AdminListController(accountService, $http) {
                var _this = this;
                this.message = "This is the admin list controller";
                $http.get('/admin', {
                    headers: {
                        Authorization: 'Bearer ' + accountService.getToken()
                    }
                }).then(function (response) {
                    _this.users = response.data;
                    console.log("this.users: " + JSON.stringify(_this.users));
                    _this.users = _this.users.map(function (ava) {
                        if (ava.avatar) {
                            ava.avatar = ava.avatar.substring(6, ava.avatar.length);
                            ava.avatar = "https://s." + ava.avatar + "?s=100&r=x&d=retro";
                        }
                        return ava;
                    });
                });
            }
            return AdminListController;
        }());
        Controllers.AdminListController = AdminListController;
        angular.module('MyApp').controller('AdminListController', AdminListController);
        var ForgotController = (function () {
            function ForgotController($http, accountService, $state) {
                this.http = $http;
                this.state = $state;
                this.accountService = accountService;
                var self = this;
                this.message = "This is the forgot form";
            }
            ForgotController.prototype.forgotPass = function () {
                console.log("newUser() this.accountService: " + this.accountService);
                this.message = "Submited";
                var email = this.user.email;
                var password = this.user.password;
                console.log("Email: " + email);
                console.log("Password: " + password);
                console.log("loginUser() this.state: " + this.state);
                var data = {
                    email: email
                };
                console.log("Data object: " + data);
                this.user.email = "";
                var self = this;
                var acct = this.accountService;
                console.log("acct: " + acct);
                acct.forgot(data).then(function () {
                    console.log("data: " + JSON.stringify(data));
                    var messContent = 'An e-mail has been sent to ' + data.email + ' with further instructions.';
                    self.message = messContent;
                }, function (err) {
                    alert(JSON.stringify(err));
                });
            };
            return ForgotController;
        }());
        Controllers.ForgotController = ForgotController;
        angular.module('MyApp').controller('ForgotController', ForgotController);
        var ResetController = (function () {
            function ResetController($http, accountService, $state, $stateParams) {
                this.http = $http;
                this.state = $state;
                this.token = $stateParams;
                this.accountService = accountService;
                var self = this;
                this.message = "This is the reset form";
            }
            ResetController.prototype.updatePassword = function () {
                console.log("updatePassword() this.accountService: " + this.accountService);
                this.message = "Submited";
                var password = this.password;
                var confirm = this.confirm;
                console.log("this.token: " + JSON.stringify(this.token));
                console.log("Password: " + password);
                console.log("Confirm: " + confirm);
                var data = {
                    password: password,
                    token: this.token['token']
                };
                console.log("Data object: " + JSON.stringify(data));
                this.password = "";
                this.confirm = "";
                var self = this;
                var acct = this.accountService;
                acct.reset(data).then(function () {
                    console.log("data: " + JSON.stringify(data));
                    self.message = "Password updated.";
                    self.state.go('StudentDisplay');
                }, function (err) {
                    alert(JSON.stringify(err));
                });
            };
            return ResetController;
        }());
        Controllers.ResetController = ResetController;
        angular.module('MyApp').controller('ResetController', ResetController);
        var NavigationController = (function () {
            function NavigationController(accountService, $rootScope, $state, $uibModal) {
                var _this = this;
                this.$uibModal = $uibModal;
                this.acct = accountService;
                this.state = $state;
                this.isLoggedIn = accountService.isLoggedIn();
                if (this.isLoggedIn) {
                    this.currentUser = accountService.currentUser();
                    if (this.currentUser.avatar) {
                        this.currentUser.avatar = this.currentUser.avatar.substring(6, this.currentUser.avatar.length);
                        this.currentUser.avatar = "https://s." + this.currentUser.avatar + "?s=30&r=x&d=retro";
                        console.log("avatar: " + this.currentUser.avatar);
                    }
                    this.isAdmin = accountService.isAdmin();
                }
                $rootScope.$on('navUpdate', function () {
                    console.log('navUpdated');
                    _this.isLoggedIn = accountService.isLoggedIn();
                    console.log("this.isLoggedIn: " + _this.isLoggedIn);
                    _this.isAdmin = accountService.isAdmin();
                    console.log("this.isAdmin: " + _this.isAdmin);
                    if (_this.isLoggedIn) {
                        _this.currentUser = accountService.currentUser();
                        if (_this.currentUser.avatar) {
                            _this.currentUser.avatar = _this.currentUser.avatar.substring(6, _this.currentUser.avatar.length);
                            _this.currentUser.avatar = "https://s." + _this.currentUser.avatar + "?s=30&r=x&d=retro";
                            console.log("avatar: " + _this.currentUser.avatar);
                        }
                    }
                });
            }
            NavigationController.prototype.logout = function () {
                console.log('clicked the logout btn');
                var self = this.state;
                this.acct.logout();
                self.go('Index');
            };
            NavigationController.prototype.showModal = function () {
                this.$uibModal.open({
                    templateUrl: '/templates/login.html',
                    controller: 'LoginController',
                    controllerAs: 'modal',
                    size: 'md'
                });
            };
            return NavigationController;
        }());
        Controllers.NavigationController = NavigationController;
        angular.module('MyApp').controller('NavigationController', NavigationController);
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
