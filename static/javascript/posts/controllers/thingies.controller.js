(function(){
  'use strict'

  angular
    .module('thingy.posts.controllers')
    .controller('ThingiesController', ThingiesController);

  ThingiesController.$inject = ['$scope', 'Authentication', 'Thingies'];

  function ThingiesController($scope, Authentication, Thingies) {
    var vm = this;

    vm.posts = Thingies.all();
    vm.numPosts = vm.posts.length;
    vm.get = get;
    vm.create = create;
    vm.remove = remove;

    function get(){
      vm.posts = Thingies.get(vm.getuser);
    }

    function create(){
      vm.posts = Thingies.create(vm.user, vm.title, vm.description);
    }

    function remove(){
      vm.posts = Thingies.remove(vm.thingyId);
    }
  }
})();
