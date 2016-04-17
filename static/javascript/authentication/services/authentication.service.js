(function(){
  'use strict'

  angular
    .module('thingy.authentication.services')
    .service('Authentication', Authentication);

  Authentication.$inject = ['$cookies', '$http', '$route', '$rootScope'];

  function Authentication($cookies, $http, $route, $rootScope) {
    var vm = this;

    vm.getAuthenticatedAccount = getAuthenticatedAccount;
    vm.isAuthenticated = isAuthenticated;
    vm.login = login;
    vm.logout = logout;
    vm.register = register;
    vm.setAuthenticatedAccount = setAuthenticatedAccount;
    vm.unauthenticate = unauthenticate;

    function login(username, password) {
      return $http.post('/api/v1/auth/login/', {
        username: username, password: password
      }).then(loginSuccessFn, loginErrorFn);

      /**
       * @name loginSuccessFn
       * @desc Set the authenticated account and redirect to index
       */
      function loginSuccessFn(data, status, headers, config) {
        vm.setAuthenticatedAccount(data.data);
        // Allows pages to save data before refresh
        $rootScope.$broadcast('login');
        // Soft refresh
        location.reload();
      }

      /**
       * @name loginErrorFn
       * @desc Log "Epic failure!" to the console
       */
      function loginErrorFn(data, status, headers, config) {
        console.error(data.data.message);
      }
    }

    function register(username, email, password) {
      return $http.post('/api/v1/accounts/', {
        username: username,
        email: email,
        password: password
      }).then(registerSuccessFn, registerErrorFn);

      /**
      * @name registerSuccessFn
      * @desc Log the new user in
      */
      function registerSuccessFn(data, status, headers, config) {
        vm.login(email, password);
      }

      /**
      * @name registerErrorFn
      * @desc Log "Epic failure!" to the console
      */
      function registerErrorFn(data, status, headers, config) {
        console.error('Epic failure!');
      }
    }

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
       * @desc Log "Epic failure!" to the console
       */
      function logoutErrorFn(data, status, headers, config) {
        console.error('Epic failure!');
      }
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
      return JSON.parse($cookies.getObject('authenticatedAccount'));
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
   * @desc Stringify the account object and store it in a cookie for 1 day
   * @param {Object} user The account object to be stored
   * @returns {undefined}
   * @memberOf thinkster.authentication.services.Authentication
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
   * @memberOf thinkster.authentication.services.Authentication
   */
    function unauthenticate() {
      $cookies.remove('authenticatedAccount');
    }
  }
})();
