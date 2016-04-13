(function(){
  'use strict'

  angular
    .module('route.authentication.controllers')
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['$location', '$scope'];

  function RegisterController($location, $scope) {
    var vm = this;

    vm.register = register;

    function register(){
      alert("Nice!");
    }
  }
})();
