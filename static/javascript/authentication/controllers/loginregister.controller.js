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
      // Already authenticated users should not be here
      if (Authentication.isAuthenticated()) {
        $location.url('/');
      }

      // For some reason this doesn't work
      // Prevent url hashing, will need to unbind
      //$('.nav-tabs a').click(function(e) { e.preventDefault(); });

      // ============================================================ //
      // The LoginRegisterController is bound to a ngDialog window.   //
      // This window does not close when using the back/next buttons  //
      // ============================================================ //

      // Close the dialog when clicking back/next browser buttons
      var cleanDialog = $rootScope.$on('$routeChangeStart', function (scope, next, current) { $scope.closeThisDialog(); });
      // Unbind the event handlers
      $scope.$on('$destroy', function() {
        cleanDialog();
        // Was bound on the template, need to unbind here
        $('.nav-tabs a').unbind('click'); });
    }

    function login() {
      console.log("Logging in...");
      Authentication.login(vm.username, vm.password);
    }

    function register() {
      console.log("Registering...");
      Authentication.register(vm.username, vm.email, vm.first_name, vm.last_name, vm.password);
    }
  }
})();
