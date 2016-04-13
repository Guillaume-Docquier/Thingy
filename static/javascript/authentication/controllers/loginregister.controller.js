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

    // ============================================================ //
    // The LoginRegisterController is bound to a ngDialog window.   //
    // This window does not close when using the back/next buttons  //
    // ============================================================ //

    // Close the dialog when clicking back/next browser buttons
    var cleanUp = $rootScope.$on('$routeChangeStart', function (scope, next, current) {
      $scope.closeThisDialog();
    });
    // Unbind the event
    $scope.$on('$destroy', function() {
      cleanUp();
    });

    //////////////////

    function login() {
      console.log("Logging in...");
      Authentication.login(vm.email, vm.password);
    }

    function register() {
      console.log("Registering...");
      Authentication.register(vm.email, vm.fullName, vm.password);
    }


  }
})();
