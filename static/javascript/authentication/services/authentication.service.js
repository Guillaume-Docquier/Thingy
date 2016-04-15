(function(){
  'use strict'

  angular
    .module('thingy.authentication.services')
    .service('Authentication', Authentication);

  Authentication.$inject = ['$cookies', '$http', '$route'];

  function Authentication($cookies, $http, $route) {
    var vm = this;

    vm.getAuthenticatedAccount = getAuthenticatedAccount;
    vm.isAuthenticated = isAuthenticated;
    vm.login = login;
    vm.logout = logout;
    vm.register = register;
    vm.setAuthenticatedAccount = setAuthenticatedAccount;
    vm.unauthenticate = unauthenticate;

    function login(username, password) {
      // For tesing only. We will return the ajax promise instead of boolean
      if (password == "yes") return loginSuccessFn(email);
      if (password == "no") return loginErrorFn(email, password);
      return $http.post('/login/', {
        username: username, password: password
      }).then(loginAjaxSuccessFn, loginAjaxErrorFn);

      function loginAjaxSuccessFn() {
        setAuthenticatedAccount({email:email, user:'Guillaume Docquier'});
        $route.reload();
      }

      function loginAjaxErrorFn() {
        alert('You wanted login to fail');
      }

      function loginSuccessFn(email){
        console.log('Logged in as ' + email);
        setAuthenticatedAccount({email:email, user:'Guillaume Docquier'});
        $route.reload();
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
      window.location = '/';
    }

    /**
   * @name getAuthenticatedAccount
   * @desc Return the currently authenticated account
   * @returns {object|undefined} Account if authenticated, else `undefined`
   * @memberOf thinkster.authentication.services.Authentication
   */
    function getAuthenticatedAccount() {
      if (!$cookies.get('authenticatedAccount')) {
        return;
      }
      return $cookies.getObject('authenticatedAccount');
    }

    /**
   * @name isAuthenticated
   * @desc Check if the current user is authenticated
   * @returns {boolean} True is user is authenticated, else false.
   * @memberOf thinkster.authentication.services.Authentication
   */
    function isAuthenticated() {
      return !!$cookies.get('authenticatedAccount');
    }

    /**
   * @name setAuthenticatedAccount
   * @desc Stringify the account object and store it in a cookie
   * @param {Object} user The account object to be stored
   * @returns {undefined}
   * @memberOf thinkster.authentication.services.Authentication
   */
    function setAuthenticatedAccount(account) {
      var now = Date.now(),
      exp = new Date(now + (24*60*60*1000)); // a day from now
      $cookies.putObject('authenticatedAccount', account, {expires:exp});
    }

    /**
   * @name unauthenticate
   * @desc Delete the cookie where the user object is stored
   * @returns {undefined}
   * @memberOf thinkster.authentication.services.Authentication
   */
    function unauthenticate() {
      $cookies.remove('authenticatedAccount');
    }
  }
})();
