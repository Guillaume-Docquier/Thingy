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

    // Functions and data
    vm.login = login;
    vm.register = register;
    vm.valid = {
      username: 0,
      email: 0,
      password: 0,
      confirm: 0
    };
    vm.validate = validate;
    vm.usernameHelp = '';
    vm.emailHelp = '';
    vm.passwordHelp = 'Password must contain numbers, lowercase and uppercase letters and be at least 8 characters long.';
    vm.confirmHelp = '';

    // Bindings
    vm.firstName = '';
    vm.lastName = '';
    vm.username = '';
    vm.email = '';
    vm.password = '';
    vm.confirmPassword = '';

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
      var redirect = $location.url();
      if($location.search().redirect)
        redirect = '/' + $location.search().redirect;
      Authentication.login(vm.username, vm.password, redirect);
    }

    /**
    * @name register
    * @desc Register a new user
    * @memberOf thingy.authentication.controllers.LoginRegisterController
    */
    function register() {
      console.log("Registering...");
      var redirect = $location.url();
      if($location.search().redirect)
        redirect = '/' + $location.search().redirect;
      Authentication.register(vm.username, vm.email, vm.firstName, vm.lastName, vm.password, vm.confirmPassword, redirect);
    }

    function validate(type) {
      switch(type) {
        case 'username':
          vm.valid.username = 1;
          vm.usernameHelp = '';
          if (vm.username.length == 0)
            vm.valid.username = 0;
          else {
            // Query db to see if username if free
            // vm.usernameHelp = 'This username is already in use.'
          }
          break;
        case 'email':
          vm.valid.email = 1;
          vm.emailHelp = '';
          if (vm.email.length == 0)
            vm.valid.email = 0;
          else {
            if (!vm.email.match(/.+\@.+\..+/)) // Match xxx@xxx.xxx
              vm.valid.email = -1;
          }
          if (vm.valid.email != 1) vm.emailHelp = 'Invalid email format. It should look like xxx@yyy.zzz';
          break;
        case 'password':
          vm.valid.password = 1;
          vm.passwordHelp = '';
          if (vm.password.length == 0)
            vm.valid.password = 0;
          else {
            if (vm.password.length < 8) // Longer than 8 char
              vm.valid.password = -1;
            if (vm.password.match(/\W/g)) // Alphanumeric only
              vm.valid.password = -1;
            if (!vm.password.match(/\d/g)) // At least 1 digit
              vm.valid.password = -1;
            if (!vm.password.match(/[A-Z]/g)) // At least 1 capital
              vm.valid.password = -1;
            if (!vm.password.match(/[a-z]/g)) // At least 1 lowercase
              vm.valid.password = -1;
          }
          if (vm.valid.password != 1) vm.passwordHelp = 'Password must contain numbers, lowercase and uppercase letters and be at least 8 characters long.';
          break;
        case 'confirm':
          vm.valid.confirm = 1;
          vm.confirmHelp = '';
          if (vm.confirmPassword.length == 0)
            vm.valid.confirm = 0;
          else {
            if (vm.password != vm.confirmPassword)
              vm.valid.confirm = -1;
            if (vm.valid.password == -1)
              vm.valid.confirm = -1;
          }
          if (vm.valid.confirm != 1) vm.confirmHelp = 'This field should match your password and your password should be valid.'
          break;
      }
    }
  }
})();
