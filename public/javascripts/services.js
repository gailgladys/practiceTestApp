var MyApp;
(function (MyApp) {
    var Services;
    (function (Services) {
        var AccountService = (function () {
            function AccountService($http, $window, $rootScope) {
                this.http = $http;
                this.window = $window;
                this.rootScope = $rootScope;
            }
            AccountService.prototype.saveToken = function (token) {
                console.log("saveToken - token: " + token);
                localStorage.setItem('mean-token', token);
            };
            AccountService.prototype.getToken = function () {
                var token = localStorage.getItem('mean-token');
                console.log("getToken - token: " + token);
                return localStorage.getItem('mean-token');
            };
            AccountService.prototype.logout = function () {
                localStorage.removeItem('mean-token');
                var token = localStorage.getItem('mean-token');
                console.log("logout - token: " + token);
                this.rootScope.$broadcast('navUpdate');
            };
            AccountService.prototype.isLoggedIn = function () {
                var token = this.getToken();
                console.log("isLoggedIn - token: " + token);
                var payload;
                if (token) {
                    payload = token.split('.')[1];
                    console.log("isLoggedIn - payload: " + payload);
                    payload = this.window.atob(payload);
                    payload = JSON.parse(payload);
                    console.log("payload['iat']: " + payload['exp']);
                    console.log("payload after .atob and .parse: " + JSON.stringify(payload));
                    console.log("Date.now()/1000: " + Date.now() / 1000);
                    return payload['exp'] > Date.now() / 1000;
                }
                else {
                    return false;
                }
            };
            AccountService.prototype.currentUser = function () {
                if (this.isLoggedIn()) {
                    var token = this.getToken();
                    console.log("token: " + token);
                    var payload = token.split('.')[1];
                    console.log("payload: " + payload);
                    payload = this.window.atob(payload);
                    payload = JSON.parse(payload);
                    return {
                        _id: payload['id'],
                        email: payload['email'],
                        name: payload['username'],
                        role: payload['role'],
                        avatar: payload['avatar']
                    };
                }
            };
            AccountService.prototype.register = function (student) {
                console.log("register - student: " + student);
                console.log("register - JSON.stringify(student): " + JSON.stringify(student));
                var self = this;
                return this.http.post('/register', student).then(function (data) {
                    console.log("register service - data: " + JSON.stringify(data));
                    console.log("register service - data.data: " + JSON.stringify(data.data));
                    console.log("register service - data.data.token: " + JSON.stringify(data.data.token));
                    self.saveToken(data.data.token);
                    self.rootScope.$broadcast('navUpdate');
                });
            };
            AccountService.prototype.login = function (student) {
                var self = this;
                return this.http.post('/login', student).then(function (data) {
                    console.log("login service - data: " + JSON.stringify(data));
                    console.log("login service - data.data: " + JSON.stringify(data.data));
                    console.log("login service - data.data.token: " + JSON.stringify(data.data.token));
                    self.saveToken(data.data.token);
                    self.rootScope.$broadcast('navUpdate');
                });
            };
            AccountService.prototype.forgot = function (student) {
                var self = this;
                return this.http.post('/forgot', student).then(function (data) {
                    console.log("forgot service - data: " + JSON.stringify(data));
                    self.rootScope.$broadcast('navUpdate');
                });
            };
            AccountService.prototype.reset = function (student) {
                var self = this;
                console.log("reset service - student: " + JSON.stringify(student));
                return this.http.post('/reset', student).then(function (data) {
                    console.log("reset service - data: " + JSON.stringify(data));
                    console.log("reset service - data.data: " + JSON.stringify(data.data));
                    console.log("reset service - data.data.token: " + JSON.stringify(data.data.token));
                    self.saveToken(data.data.token);
                    self.rootScope.$broadcast('navUpdate');
                });
            };
            AccountService.prototype.secret = function () {
                var self = this;
                var payload = this.getToken();
                console.log("secret() payload: " + payload);
                return this.http.get('/profile').then(function (data) {
                    console.log("secret service - data: " + JSON.stringify(data));
                    self.rootScope.$broadcast('navUpdate');
                });
            };
            AccountService.prototype.isAdmin = function () {
                console.log('hit service isAdmin()');
                console.log("isLoggedIn(): " + this.isLoggedIn());
                if (this.isLoggedIn()) {
                    var token = this.getToken();
                    console.log("token: " + token);
                    var payload = token.split('.')[1];
                    console.log("payload: " + payload);
                    payload = this.window.atob(payload);
                    payload = JSON.parse(payload);
                    if (payload['role'] == 'admin') {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            };
            return AccountService;
        }());
        Services.AccountService = AccountService;
        angular.module('MyApp').service('accountService', AccountService);
    })(Services = MyApp.Services || (MyApp.Services = {}));
})(MyApp || (MyApp = {}));
