(function(){
  'use strict'

  angular
    .module('route.authentication.controllers')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$location', '$scope', 'Authentication'];

  function LoginController($location, $scope, Authentication) {
    var vm = this;

    vm.login = login;

    function login() {
      console.log('Logging in...');
      Authentication.login(vm.email, vm.password);
    }
  }
})();
