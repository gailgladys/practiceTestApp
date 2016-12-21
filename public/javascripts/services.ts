namespace MyApp.Services {

  export class AccountService{

    public http;
    public window;
    public user;
    public token;
    public rootScope;

    saveToken(token) {
      console.log(`saveToken - token: ${token}`);
      localStorage.setItem('mean-token', token);
    }

    getToken(){
      let token = localStorage.getItem('mean-token');
      console.log(`getToken - token: ${token}`);
      return localStorage.getItem('mean-token');
    }

    logout(){
      localStorage.removeItem('mean-token');
      this.rootScope.$broadcast('navUpdate');
    }

    isLoggedIn() {
      var token = this.getToken();
      console.log(`isLoggedIn - token: ${token}`);
      var payload;

      if(token){
        payload = token.split('.')[1];
        console.log(`isLoggedIn - payload: ${payload}`);
        payload = this.window.atob(payload);
        payload = JSON.parse(payload);
        console.log(`payload['iat']: ${payload['exp']}`);
        console.log(`payload after .atob and .parse: ${JSON.stringify(payload)}`);
        console.log(`Date.now()/1000: ${Date.now() / 1000}`);
        return payload['exp'] > Date.now() / 1000;
      } else {
        return false;
      }
    }

    currentUser() {
      if(this.isLoggedIn()){
        var token = this.getToken();
        console.log(`token: ${token}`);
        var payload = token.split('.')[1];
        console.log(`payload: ${payload}`);
        payload = this.window.atob(payload);
        payload = JSON.parse(payload);

        return {
          _id: payload['id'],
          email : payload['email'],
          name : payload['username'],
          role : payload['role'],
          avatar: payload['avatar']
        };
      }
    }

    register(student) {
      console.log(`register - student: ${student}`);
      console.log(`register - JSON.stringify(student): ${JSON.stringify(student)}`);
      let self = this;
      return this.http.post('/register', student).then(function(data){
        console.log(`register service - data: ${JSON.stringify(data)}`);
        console.log(`register service - data.data: ${JSON.stringify(data.data)}`);
        console.log(`register service - data.data.token: ${JSON.stringify(data.data.token)}`);
        self.saveToken(data.data.token);
        self.rootScope.$broadcast('navUpdate');
      });
    }

    login(student) {
      let self = this;
      return this.http.post('/login', student).then(function(data) {
        console.log(`login service - data: ${JSON.stringify(data)}`);
        console.log(`login service - data.data: ${JSON.stringify(data.data)}`);
        console.log(`login service - data.data.token: ${JSON.stringify(data.data.token)}`);
        self.saveToken(data.data.token);
        self.rootScope.$broadcast('navUpdate');
      });
    }

    forgot(student) {
      let self = this;
      return this.http.post('/forgot', student).then(function(data) {
        console.log(`forgot service - data: ${JSON.stringify(data)}`);
        self.rootScope.$broadcast('navUpdate');
      });
    }

    reset(student) {
      let self = this;
      return this.http.post('/reset', student).then(function(data) {
        console.log(`reset service - data: ${JSON.stringify(data)}`);
        self.rootScope.$broadcast('navUpdate');
      });
    }

    secret() {
      let self = this;
      let payload = this.getToken();
      console.log(`secret() payload: ${payload}`);
      return this.http.get('/profile').then(function(data) {
        console.log(`secret service - data: ${JSON.stringify(data)}`);
        self.rootScope.$broadcast('navUpdate');
      });
    }

    public isAdmin() {
      console.log('hit service isAdmin()');
      console.log(`isLoggedIn(): ${this.isLoggedIn()}`);
      if(this.isLoggedIn()){
        var token = this.getToken();
        console.log(`token: ${token}`);
        var payload = token.split('.')[1];
        console.log(`payload: ${payload}`);
        payload = this.window.atob(payload);
        payload = JSON.parse(payload);
        if (payload['role']=='admin'){
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }

    constructor($http: ng.IHttpService, $window: ng.IWindowService, $rootScope: ng.IRootScopeService){
      this.http = $http;
      this.window = $window;
      this.rootScope = $rootScope;
    }
  }
  angular.module('MyApp').service('accountService', AccountService);

}
