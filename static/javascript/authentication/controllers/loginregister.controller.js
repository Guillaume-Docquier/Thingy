/**
* LoginRegisterController
* @namespace thingy.authentication.controllers
*/
(function(){
  'use strict'

  angular
    .module('thingy.authentication.controllers')
    .controller('LoginRegisterController', LoginRegisterController);

  LoginRegisterController.$inject = ['$location', '$rootScope', '$scope', 'Authentication', 'Profile'];

  /**
  * @namespace LoginRegisterController
  */
  function LoginRegisterController($location, $rootScope, $scope, Authentication, Profile) {
    var vm = this;

    // Functions and data
    vm.login = login;
    vm.register = register;
    vm.validate = validate;
    vm.formIsValid = formIsValid;
    vm.clearValidity = clearValidity;
    vm.valid = {
      firstName: 0,
      lastName: 0,
      username: 0,
      email: 0,
      password: 0,
      confirm: 0
    };
    vm.help = {
      username: '',
      email: '',
      password: 'Password must contain numbers, lowercase and uppercase letters and be at least 8 characters long.',
      confirm: ''
    };

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
      if (!vm.formIsValid())
      {
        alert('Some information is missing.');
        return;
      }
      var redirect = $location.url();
      if($location.search().redirect)
        redirect = '/' + $location.search().redirect;
      Authentication.register(vm.username, vm.email, vm.firstName, vm.lastName, vm.password, vm.confirmPassword, redirect);

      function showErrors() {
        // Put errors on empty fields
        for (var key in vm.valid) {
          if (vm.valid.hasOwnProperty(key)) {
            if (vm.valid[key] != 1) vm.valid[key] = -1;
          }
        }
      }
    }

    function validate(type) {
      switch(type) {
        case 'firstName':
          vm.valid.firstName = 1;
          if (vm.firstName.length == 0)
            vm.valid.firstName = -1;
          break;
        case 'lastName':
          vm.valid.lastName = 1;
          if (vm.lastName.length == 0)
            vm.valid.lastName = -1;
          break;
        case 'username':
          vm.valid.username = 1;
          vm.usernameHelp = '';
          if (vm.username.length == 0)
            vm.valid.username = -1;
          else {
            Profile.usernameAvailable(vm.username).then(querySuccessFn, queryErrorFn);

            function querySuccessFn(data) {
              // Username is in use because it was found
              if (data.data.length > 0)
              {
                vm.help.username = 'This username is already in use.';
                vm.valid.username = -1;
              }
            }

            function queryErrorFn(data) {
              alert('Error checking availability.');
              console.error('Error: ' + JSON.stringify(data.data));
            }
          }
          if (vm.valid.username != -1) vm.help.username = '';
          break;
        case 'email':
          vm.valid.email = 1;
          vm.help.email = '';
          if (!vm.email.match(/.+\@.+\..+/)) // Match xxx@xxx.xxx
          {
            vm.valid.email = -1;
            vm.help.email = 'Invalid email format. It should look like xxx@yyy.zzz';
          }
          break;
        case 'password':
          vm.valid.password = 1;
          vm.help.password = '';
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
          if (vm.valid.password != 1) vm.help.password = 'Password must contain numbers, lowercase and uppercase letters and be at least 8 characters long.';
          break;
        case 'confirm':
          vm.valid.confirm = 1;
          vm.help.confirm = '';
          if (vm.confirmPassword.length == 0)
            vm.valid.confirm = 0;
          else {
            if (vm.password != vm.confirmPassword) // Must match the password
              vm.valid.confirm = -1;
            if (vm.valid.password == -1) // Password must be valid
              vm.valid.confirm = -1;
          }
          if (vm.valid.confirm != 1) vm.help.confirm = 'This field should match your password and your password should be valid.';
          break;
      }
    }

    function formIsValid() {
      var valid = 1;
      for (var key in vm.valid) {
        if (vm.valid.hasOwnProperty(key) && vm.valid[key] != 1)
        {
          valid = 0;
          vm.valid[key] = -1; // Set empty fields to errors
        }
      }
      return valid;
    }

    function clearValidity(fieldName) {
      vm.valid[fieldName] = 0;
    }
  }
})();
