namespace MyApp {

  angular.module('MyApp', ['ui.router', 'ngResource', 'ui.bootstrap','ngAnimate','timer']).config(($stateProvider: ng.ui.IStateProvider, $locationProvider: ng.ILocationProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) => {
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
              controller: MyApp.Controllers.TestBankController,
              controllerAs: 'vm'
          })
          .state('TestArray', {
              url: '/testArray',
              templateUrl: "/templates/testArray.html",
              controller: MyApp.Controllers.TestArrayController,
              controllerAs: 'vm'
          })
          .state('TestRandomizer', {
              url: '/testRandomizer',
              templateUrl: "/templates/testRandomizer.html",
              controller: MyApp.Controllers.TestRandomizerController,
              controllerAs: 'vm'
          })
          .state('Login', {
              url: '/login',
              templateUrl: "/templates/login.html",
              controller: MyApp.Controllers.LoginController,
              controllerAs: 'modal'
          })
          .state('Register', {
              url: '/register',
              templateUrl: "/templates/register.html",
              controller: MyApp.Controllers.RegistrationController,
              controllerAs: 'vm'
          })
          .state('QuestionForm', {
              url: '/questionForm',
              templateUrl: "/templates/questionForm.html",
              controller: MyApp.Controllers.QuestionFormController,
              controllerAs: 'ctrl'
          })
          .state('Admin', {
              url: '/admin',
              templateUrl: "/templates/admin.html",
              controller: MyApp.Controllers.AdminController,
              controllerAs: 'vm'
          })
          .state('PracticeTest', {
              url: '/practiceTest',
              templateUrl: "/templates/practiceTest.html",
              controller: MyApp.Controllers.PracticeTestController,
              controllerAs: 'vm'
          });
      $urlRouterProvider.otherwise('/');
      $locationProvider.html5Mode(true);
  });

  angular.module('MyApp').run((
        $rootScope: ng.IRootScopeService,
        $state: ng.ui.IStateService,
        accountService: MyApp.Services.AccountService
    ) => {
            $rootScope.$on('$stateChangeStart', (e, to) => {
                // protect non-public views
                if (to.data && to.data.requiresAuthentication) {
                    if (!accountService.isLoggedIn()) {
                        e.preventDefault();
                        $state.go('Index');
                    }
                }
            });
    });

}
