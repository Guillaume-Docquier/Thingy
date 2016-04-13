(function(){
  'use strict'

  angular
    .module('thingy.posts.controllers')
    .controller('ThingiesController', ThingiesController);

  ThingiesController.$inject = ['$scope', 'Authentication'];

  function ThingiesController($scope, Authentication) {
    var vm = this;

    vm.posts = 2;
  }
})();
