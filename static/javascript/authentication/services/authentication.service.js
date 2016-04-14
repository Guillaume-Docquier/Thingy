(function(){
  'use strict'

  angular
    .module('thingy.authentication.services')
    .service('Authentication', Authentication);

  Authentication.$inject = ['$cookies', '$http'];

  function Authentication($cookies, $http) {
    var vm = this;

    vm.getAuthenticatedAccount = getAuthenticatedAccount;
    vm.isAuthenticated = isAuthenticated;
    vm.login = login;
    vm.logout = logout;
    vm.register = register;
    vm.setAuthenticatedAccount = setAuthenticatedAccount;
    vm.unauthenticate = unauthenticate;

    function login(email, password) {
      // For tesing only. We will return the ajax promise instead of boolean
      if (password == "yes") return loginSuccessFn(email);
      if (password == "no") return loginErrorFn(email, password);
      //$http.post('/thingy/signin')

      function loginSuccessFn(email){
        console.log('Logged in as ' + email);
        setAuthenticatedAccount({email:email});
        return true;
        //window.location = '/';
      }
      function loginErrorFn(email, password){
        console.log("Login failed.");
        alert('You wanted login to fail');
        return false;
      }
    }

    function register(email, fullName, password) {
      // For tesing only. We will return the ajax promise instead of boolean
      if (password == "yes") return registerSuccessFn(email, password);
      if (password == "no") return registerErrorFn();
      //$http.post('/thingy/signin')

      function registerSuccessFn(email, password){
        console.log('Registering ' + email);
        return login(email, password);
        //window.location = '/';
      }
      function registerErrorFn(){
        console.log("Register failed.");
        alert('You wanted register to fail');
        return false;
      }
    }

    function logout() {
      console.log("Logout!");
      unauthenticate();
    }

    /**
   * @name getAuthenticatedAccount
   * @desc Return the currently authenticated account
   * @returns {object|undefined} Account if authenticated, else `undefined`
   * @memberOf thinkster.authentication.services.Authentication
   */
    function getAuthenticatedAccount() {
      if (!$cookies.authenticatedAccount) {
        return;
      }
      return JSON.parse($cookies.authenticatedAccount);
    }

    /**
   * @name isAuthenticated
   * @desc Check if the current user is authenticated
   * @returns {boolean} True is user is authenticated, else false.
   * @memberOf thinkster.authentication.services.Authentication
   */
    function isAuthenticated() {
      return !!$cookies.authenticatedAccount;
    }

    /**
   * @name setAuthenticatedAccount
   * @desc Stringify the account object and store it in a cookie
   * @param {Object} user The account object to be stored
   * @returns {undefined}
   * @memberOf thinkster.authentication.services.Authentication
   */
    function setAuthenticatedAccount(account) {
      $cookies.authenticatedAccount = JSON.stringify(account);
    }

    /**
   * @name unauthenticate
   * @desc Delete the cookie where the user object is stored
   * @returns {undefined}
   * @memberOf thinkster.authentication.services.Authentication
   */
    function unauthenticate() {
      delete $cookies.authenticatedAccount;
    }
  }
})();
