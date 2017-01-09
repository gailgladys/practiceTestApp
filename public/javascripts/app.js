var MyApp;
(function (MyApp) {
    angular.module('MyApp', ['ui.router', 'ngResource', 'ui.bootstrap', 'ngAnimate', 'timer']).config(function ($stateProvider, $locationProvider, $urlRouterProvider) {
        $stateProvider
            .state('Index', {
            url: '/',
            templateUrl: "/templates/home.html",
            controller: MyApp.Controllers.MainController,
            controllerAs: 'Main'
        })
            .state('TestBank', {
            url: '/testBank',
            templateUrl: "/templates/testBank.html",
            data: {
                requiresAdmin: true
            },
            controller: MyApp.Controllers.TestBankController,
            controllerAs: 'vm'
        })
            .state('TestArray', {
            url: '/testArray',
            templateUrl: "/templates/testArray.html",
            data: {
                requiresAdmin: true
            },
            controller: MyApp.Controllers.TestArrayController,
            controllerAs: 'vm'
        })
            .state('TestRandomizer', {
            url: '/testRandomizer',
            templateUrl: "/templates/testRandomizer.html",
            data: {
                requiresAdmin: true
            },
            controller: MyApp.Controllers.TestRandomizerController,
            controllerAs: 'vm'
        })
            .state('AdminList', {
            url: '/adminList',
            templateUrl: "/templates/adminList.html",
            data: {
                requiresAdmin: true
            },
            controller: MyApp.Controllers.AdminListController,
            controllerAs: 'vm'
        })
            .state('Login', {
            url: '/login',
            templateUrl: "/templates/login.html",
            controller: MyApp.Controllers.LoginController,
            controllerAs: 'modal'
        })
            .state('StudentDisplay', {
            url: '/studentDisplay',
            templateUrl: "/templates/studentDisplay.html",
            data: {
                requiresAuthentication: true
            },
            controller: MyApp.Controllers.StudentDisplayController,
            controllerAs: 'vm'
        })
            .state('GradeDisplay', {
            url: '/gradeDisplay',
            templateUrl: "/templates/gradeDisplay.html",
            data: {
                requiresAuthentication: true
            },
            controller: MyApp.Controllers.GradeDisplayController,
            controllerAs: 'vm'
        })
            .state('Register', {
            url: '/register',
            templateUrl: "/templates/register.html",
            controller: MyApp.Controllers.RegistrationController,
            controllerAs: 'vm'
        })
            .state('Reset', {
            url: '/reset/:token',
            templateUrl: "/templates/reset.html",
            controller: MyApp.Controllers.ResetController,
            controllerAs: 'vm'
        })
            .state('Forgot', {
            url: '/forgot',
            templateUrl: "/templates/forgot.html",
            controller: MyApp.Controllers.ForgotController,
            controllerAs: 'vm'
        })
            .state('QuestionForm', {
            url: '/questionForm',
            templateUrl: "/templates/questionForm.html",
            data: {
                requiresAdmin: true
            },
            controller: MyApp.Controllers.QuestionFormController,
            controllerAs: 'ctrl'
        })
            .state('Admin', {
            url: '/admin',
            templateUrl: "/templates/admin.html",
            data: {
                requiresAdmin: true
            },
            controller: MyApp.Controllers.AdminController,
            controllerAs: 'vm'
        })
            .state('PracticeTest', {
            url: '/practiceTest',
            templateUrl: "/templates/practiceTest.html",
            data: {
                requiresAuthentication: true
            },
            controller: MyApp.Controllers.PracticeTestController,
            controllerAs: 'vm'
        });
        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);
    });
    angular.module('MyApp').run(function ($rootScope, $state, accountService) {
        $rootScope.$on('$stateChangeStart', function (e, to) {
            if (to.data && to.data.requiresAuthentication) {
                if (!accountService.isLoggedIn()) {
                    e.preventDefault();
                    $state.go('Index');
                }
            }
            if (to.data && to.data.requiresAdmin) {
                if (!accountService.isAdmin()) {
                    e.preventDefault();
                    $state.go('Index');
                }
            }
        });
    });
})(MyApp || (MyApp = {}));
