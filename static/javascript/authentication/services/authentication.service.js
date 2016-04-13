(function(){
  'use strict'

  angular
    .module('route.authentication.services')
    .service('Authentication', Authentication);

  Authentication.$inject = ['$cookies', '$http'];

  function Authentication($cookies, $http) {
    var vm = this;

    //vm.getAuthenticatedAccount = getAuthenticatedAccount;
    //vm.isAuthenticated = isAuthenticated;
    vm.login = login;
    //vm.logout = logout;
    vm.register = register;
    //vm.setAuthenticatedAccount = setAuthenticatedAccount;
    //vm.unauthenticate = unauthenticate;

    function login(email, password) {
      // For tesing only
      $http.post('/thingy/signin')
      if (email == "no@no.no" || password == "no")
        loginErrorFn(email, password);
      else loginSuccessFn(email);

      function loginSuccessFn(email){
        console.log('Logged in as ' + email);
        window.location = '/';
      }
      function loginErrorFn(email, password){
        console.log("Login failed.");
        alert('You wanted login to fail');
      }
    }
    function register(email, fullName, password) {
      // For testing only
      if (email == 'no@no.no' || fullName == 'no' || password == 'no') alert('You wanted register to fail');
      else {
        console.log("Register successful");
        window.location = '/';
      }
    }
  }
})();
