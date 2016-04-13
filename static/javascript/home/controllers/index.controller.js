(function(){
  'use strict'

  angular
    .module('thingy.home.controllers')
    .controller('IndexController', IndexController);

  IndexController.$inject = ['$scope'];

  function IndexController($scope) {
    var vm = this;

    vm.welcome = 'Be my guest!';
  }
})();
