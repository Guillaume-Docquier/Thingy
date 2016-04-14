(function(){
  'use strict'

  angular
    .module('thingy.profiles.controllers')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$scope', 'Authentication'];

  function ProfileController($scope, Authentication) {
    var vm = this;

    vm.username = 'Guillaume';
  }
})();
