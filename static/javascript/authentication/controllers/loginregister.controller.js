/**
* LoginRegisterController
* @namespace thingy.authentication.controllers
*/
(function(){
  'use strict'

  angular
    .module('thingy.authentication.controllers')
    .controller('LoginRegisterController', LoginRegisterController);

  LoginRegisterController.$inject = ['$location', '$rootScope', '$scope', 'Authentication'];

  /**
  * @namespace LoginRegisterController
  */
  function LoginRegisterController($location, $rootScope, $scope, Authentication) {
    var vm = this;

    vm.login = login;
    vm.register = register;

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf thingy.authentication.controllers.LoginRegisterController
    */
    function activate() {
      // Already authenticated users should not be here
      if (Authentication.isAuthenticated()) {
        $location.url('/');
        alert('You are already logged in');
        return
      }

      // ============================================================ //
      // The LoginRegisterController is bound to a ngDialog window.   //
      // This window does not close when using the back/next buttons. //
      // ============================================================ //

      // Close the dialog when clicking back/next browser buttons
      var cleanDialog = $rootScope.$on('$routeChangeStart', function (scope, next, current) { $scope.closeThisDialog(); });
      // Unbind the event handlers
      $scope.$on('$destroy', function() {
        cleanDialog();
        // Was bound on the template, need to unbind here
        $('.nav-tabs a').unbind('click');
      });
    }

    /**
    * @name login
    * @desc Log the user in
    * @memberOf thingy.authentication.controllers.LoginRegisterController
    */
    function login() {
      console.log("Logging in...");
      Authentication.login(vm.username, vm.password, $location.search().redirect || $location.url());
    }

    /**
    * @name register
    * @desc Register a new user
    * @memberOf thingy.authentication.controllers.LoginRegisterController
    */
    function register() {
      console.log("Registering...");
      Authentication.register(vm.username, vm.email, vm.firstName, vm.lastName, vm.password, $location.search().redirect || $location.url());
    }
  }
})();
