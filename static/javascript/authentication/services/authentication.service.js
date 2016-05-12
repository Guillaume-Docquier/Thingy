/**
* Authentication
* @namespace thingy.authentication.services
*/
(function(){
  'use strict'

  angular
    .module('thingy.authentication.services')
    .service('Authentication', Authentication);

  Authentication.$inject = ['$cookies', '$http', '$route', '$rootScope'];

  /**
  * @namespace Authentication
  * @desc Service for authenticating users
  */
  function Authentication($cookies, $http, $route, $rootScope) {
    var vm = this;

    vm.getAuthenticatedAccount = getAuthenticatedAccount;
    vm.isAuthenticated = isAuthenticated;
    vm.login = login;
    vm.logout = logout;
    vm.register = register;
    vm.setAuthenticatedAccount = setAuthenticatedAccount;
    vm.unauthenticate = unauthenticate;
    vm.redirect = '';

    /**
    * @name login
    * @desc Try to log a user in
    * @param {string} username The username entered by the user
    * @param {string} password The password entered by the user
    * @returns {Promise}
    * @memberOf thingy.authentication.services.Authentication
    */
    function login(username, password, redirect) {
      vm.redirect = redirect;
      return $http.post('/api/v1/auth/login/', {
        username: username, password: password
      }).then(loginSuccessFn, loginErrorFn);

      /**
       * @name loginSuccessFn
       * @desc Set the authenticated account and reload the page
       */
      function loginSuccessFn(data, status, headers, config) {
        vm.setAuthenticatedAccount(data.data);
        // Allows pages to save data before refresh
        $rootScope.$broadcast('login');
        //location.reload();
        console.log('redir: ' + vm.redirect);
        window.location = vm.redirect;
      }

      /**
       * @name loginErrorFn
       * @desc Log the error in the console
       */
      function loginErrorFn(data) {
        alert('Could not log in.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }

    /**
    * @name register
    * @desc Try to register a new user
    * @param {string} username The username entered by the user
    * @param {string} email The email entered by the user
    * @param {string} first_name The first name entered by the user
    * @param {string} last_name The last name entered by the user
    * @param {string} password The password entered by the user
    * @returns {Promise}
    * @memberOf thingy.authentication.services.Authentication
    */
    function register(username, email, first_name, last_name, password, redirect) {
      vm.redirect = redirect;
      return $http.post('/api/v1/accounts/', {
        username: username,
        email: email,
        first_name: first_name,
        last_name: last_name,
        password: password
      }).then(registerSuccessFn, registerErrorFn);

      /**
      * @name registerSuccessFn
      * @desc Log the new user in
      */
      function registerSuccessFn(data, status, headers, config) {
        vm.login(email, password, vm.redirect);
      }

      /**
      * @name registerErrorFn
      * @desc Log the error in the console
      */
      function registerErrorFn(data) {
        alert('Could not register.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }

    /**
    * @name logout
    * @desc Log the user out
    * @returns {Promise}
    * @memberOf thingy.authentication.services.Authentication
    */
    function logout() {
      return $http.post('/api/v1/auth/logout/')
        .then(logoutSuccessFn, logoutErrorFn);

      /**
       * @name logoutSuccessFn
       * @desc Unauthenticate and redirect to index with page reload
       */
      function logoutSuccessFn(data, status, headers, config) {
        vm.unauthenticate();
        window.location = '/';
      }

      /**
       * @name logoutErrorFn
       * @desc Log "Logout failed..." to the console
       */
      function logoutErrorFn(data) {
        alert('Could not log out.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }

    /**
   * @name getAuthenticatedAccount
   * @desc Return the currently authenticated account
   * @returns {object|undefined} Account if authenticated, else `undefined`
   * @memberOf thingy.authentication.services.Authentication
   */
   function getAuthenticatedAccount() {
      if (!$cookies.get('authenticatedAccount')) {
        return;
      }
      return JSON.parse($cookies.getObject('authenticatedAccount'));
    }

    /**
   * @name isAuthenticated
   * @desc Check if the current user is authenticated
   * @returns {boolean} True is user is authenticated, else false.
   * @memberOf thingy.authentication.services.Authentication
   */
    function isAuthenticated() {
      return !!$cookies.get('authenticatedAccount');
    }

    /**
   * @name setAuthenticatedAccount
   * @desc Stringify the account object and store it in a cookie for 1 day
   * @param {Object} user The account object to be stored
   * @returns {undefined}
   * @memberOf thingy.authentication.services.Authentication
   */
    function setAuthenticatedAccount(account) {
      var now = Date.now(),
      exp = new Date(now + (24*60*60*1000)); // a day from now
      $cookies.putObject('authenticatedAccount', JSON.stringify(account), {expires:exp});
    }

    /**
   * @name unauthenticate
   * @desc Delete the cookie where the user object is stored
   * @returns {undefined}
   * @memberOf thingy.authentication.services.Authentication
   */
    function unauthenticate() {
      $cookies.remove('authenticatedAccount');
    }
  }
})();
