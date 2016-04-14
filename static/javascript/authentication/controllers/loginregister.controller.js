(function(){
  'use strict'

  angular
    .module('thingy.authentication.controllers')
    .controller('LoginRegisterController', LoginRegisterController);

  LoginRegisterController.$inject = ['$location', '$rootScope', '$scope', 'Authentication'];

  function LoginRegisterController($location, $rootScope, $scope, Authentication) {
    var vm = this;

    vm.login = login;
    vm.register = register;

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf thingy.home.controllers.NavbarController
    */
    function activate() {

      // ============================================================ //
      // The LoginRegisterController is bound to a ngDialog window.   //
      // This window does not close when using the back/next buttons  //
      // ============================================================ //

      // Close the dialog when clicking back/next browser buttons
      var cleanUp = $rootScope.$on('$routeChangeStart', function (scope, next, current) { $scope.closeThisDialog(); });
      // Unbind the event
      $scope.$on('$destroy', function() { cleanUp(); });
    }

    function login() {
      console.log("Logging in...");
      success(Authentication.login(vm.email, vm.password));
    }

    function register() {
      console.log("Registering...");
      success(Authentication.register(vm.email, vm.fullName, vm.password));
    }

    // For tesing only. The ajax promise will be returned instead of boolean
    function success(isTrue) {
      if (isTrue) {
        $scope.closeThisDialog();
        $rootScope.$broadcast('user.authentication');
      }
    }
  }
})();
