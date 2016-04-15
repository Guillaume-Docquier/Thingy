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

    activate();

    function activate() {
      // Set the owned property
      if(Authentication.isAuthenticated())
      {
        var auth = Authentication.getAuthenticatedAccount();
        for(var i = 0; i < vm.numPosts; i++)
        {
          if(vm.posts[i].user == auth.user) vm.posts[i].owned = true;
        }
      }
    }

    function get(){
      vm.posts = Thingies.get(vm.getuser);
      updateNumPosts();
    }

    function create(){
      // Create post
      vm.posts = Thingies.create(vm.user, vm.title, vm.description);
      // Update number of posts
      updateNumPosts();
      // Make sure to set the owned property
      vm.posts[vm.numPosts-1].owned = true;
      // Reset the form
      resetForms();
    }

    function remove(id){
      vm.posts = Thingies.remove(id);
      updateNumPosts();
    }

    function updateNumPosts() {
      vm.numPosts = vm.posts.length;
    }

    function resetForms() {
      vm.title = vm.description = vm.user = vm.getuser = "";
    }
  }
})();
