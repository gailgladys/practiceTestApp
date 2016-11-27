namespace MyApp.Services {
  // angular.module("MyServices",[]);
//   angular.module('MyApp').factory('AuthService',
//   ['$q', '$timeout', '$http',
//   function ($q, $timeout, $http) {
//
//     // create user variable
//     var user = null;
//
//     // functions defined
//       //isLoggedIn
//     function isLoggedIn() {
//       if(user) {
//         return true;
//       } else {
//         return false;
//       }
//     }
//       //getUserStatus
//     function getUserStatus() {
//       return $http.get('/user/status')
//       //handle success
//       .success(function(data){
//         if(data.status){
//           user = true;
//         } else {
//           user = false
//         }
//       })
//       //handle error
//       .error(function(data){
//         user = false;
//       });
//     }
//       //login
//     function login(username, password) {
//
//       // create a new instance of deferred
//       var deferred = $q.defer();
//
//       // send a post request to the server
//       $http.post('/user/login',
//         {username: username, password: password})
//         // handle success
//         .success(function (data, status) {
//           if(status === 200 && data.status){
//             user = true;
//             deferred.resolve();
//           } else {
//             user = false;
//             deferred.reject();
//           }
//         })
//         // handle error
//         .error(function (data) {
//           user = false;
//           deferred.reject();
//         });
//
//       // return promise object
//       return deferred.promise;
//
//     }
//       //logout
//     function logout() {
//
//       // create a new instance of deferred
//       var deferred = $q.defer();
//
//       // send a get request to the server
//       $http.get('/user/logout')
//         // handle success
//         .success(function (data) {
//           user = false;
//           deferred.resolve();
//         })
//         // handle error
//         .error(function (data) {
//           user = false;
//           deferred.reject();
//         });
//
//       // return promise object
//       return deferred.promise;
//
//     }
//       //register
//     function register(username, password) {
//
//       // create a new instance of deferred
//       var deferred = $q.defer();
//
//       // send a post request to the server
//       $http.post('/user/register',
//         {username: username, password: password})
//         // handle success
//         .success(function (data, status) {
//           if(status === 200 && data.status){
//             deferred.resolve();
//           } else {
//             deferred.reject();
//           }
//         })
//         // handle error
//         .error(function (data) {
//           deferred.reject();
//         });
//
//       // return promise object
//       return deferred.promise;
//
//     }
//
//     // return available functions for use in the controllers
//     return ({
//       isLoggedIn: isLoggedIn,
//       getUserStatus: getUserStatus,
//       login: login,
//       logout: logout,
//       register: register
//     });
//
// }]);

let loginBool = "";

export class AccountService {

    public http;

    public login(data) {
      console.log(`Account Service:`);
      console.log(`Username: ${data.username}`);
      console.log(`Email: ${data.email}`);
      console.log(`Password: ${data.password}`);
      this.http.post("/v1/api/Login/Local", data).success(function(data,status){
        console.log(data);
        console.log(data.user.username);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('status', data.user.status);
        console.log('Storage complete')
        let testToken = localStorage.getItem('token');
        let testUsername = localStorage.getItem('username');
        let testEmail = localStorage.getItem('email');
        let testStatus = localStorage.getItem('status');
        console.log(`Storage Token: ${testToken}`);
        console.log(`Storage Username: ${testUsername}`);
        console.log(`Storage Email: ${testEmail}`);
        console.log(`Storage Status: ${testStatus}`);
        loginBool = testUsername;
        console.log(`loginBool: ${loginBool}`);
      });
    }

    public logout() {
      localStorage.setItem('token', '');
      localStorage.setItem('username', '');
      localStorage.setItem('email', '');
      localStorage.setItem('status', '');
      console.log('Storage complete')
      let testToken = localStorage.getItem('token');
      let testUsername = localStorage.getItem('username');
      let testEmail = localStorage.getItem('email');
      let testStatus = localStorage.getItem('status');
      console.log(`Storage Token: ${testToken}`);
      console.log(`Storage Username: ${testUsername}`);
      console.log(`Storage Email: ${testEmail}`);
      console.log(`Storage Status: ${testStatus}`);
      loginBool = "";
      console.log(`loginBool: ${loginBool}`);
    }

    public isLoggedIn() {
         return loginBool;
    }

    constructor($http: ng.IHttpService){
      this.http = $http;
    }

 }

 angular.module('MyApp').service('accountService', AccountService);

}
