var MyApp;
(function (MyApp) {
    var Services;
    (function (Services) {
        var loginBool = "";
        var AccountService = (function () {
            function AccountService($http) {
                this.http = $http;
            }
            AccountService.prototype.login = function (data) {
                console.log("Account Service:");
                console.log("Username: " + data.username);
                console.log("Email: " + data.email);
                console.log("Password: " + data.password);
                this.http.post("/v1/api/Login/Local", data).success(function (data, status) {
                    console.log(data);
                    console.log(data.user.username);
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('username', data.user.username);
                    localStorage.setItem('email', data.user.email);
                    localStorage.setItem('status', data.user.status);
                    console.log('Storage complete');
                    var testToken = localStorage.getItem('token');
                    var testUsername = localStorage.getItem('username');
                    var testEmail = localStorage.getItem('email');
                    var testStatus = localStorage.getItem('status');
                    console.log("Storage Token: " + testToken);
                    console.log("Storage Username: " + testUsername);
                    console.log("Storage Email: " + testEmail);
                    console.log("Storage Status: " + testStatus);
                    loginBool = testUsername;
                    console.log("loginBool: " + loginBool);
                });
            };
            AccountService.prototype.logout = function () {
                localStorage.setItem('token', '');
                localStorage.setItem('username', '');
                localStorage.setItem('email', '');
                localStorage.setItem('status', '');
                console.log('Storage complete');
                var testToken = localStorage.getItem('token');
                var testUsername = localStorage.getItem('username');
                var testEmail = localStorage.getItem('email');
                var testStatus = localStorage.getItem('status');
                console.log("Storage Token: " + testToken);
                console.log("Storage Username: " + testUsername);
                console.log("Storage Email: " + testEmail);
                console.log("Storage Status: " + testStatus);
                loginBool = "";
                console.log("loginBool: " + loginBool);
            };
            AccountService.prototype.isLoggedIn = function () {
                return loginBool;
            };
            return AccountService;
        }());
        Services.AccountService = AccountService;
        angular.module('MyApp').service('accountService', AccountService);
    })(Services = MyApp.Services || (MyApp.Services = {}));
})(MyApp || (MyApp = {}));
