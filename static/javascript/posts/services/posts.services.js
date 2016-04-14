(function(){
  'use strict'

  angular
    .module('thingy.posts.services')
    .service('Thingies', Thingies);

  Thingies.$inject = ['$http'];

  function Thingies($http) {
    var vm = this;

    vm.all = all;
    vm.get = get;
    vm.create = create;
    vm.remove = remove;

    vm.testValues = [
      {id:0, user: 'Guillaume Docquier', title: 'My Favorite Thingy', description: 'Please take care of it'},
      {id:1, user: 'Jeremy Gouin', title: 'Big Big Muscles', description: 'Someone needs a hand?'},
      {id:2, user: 'Manfred Balvet', title: 'Will Win Your Game', description: 'I can win any football game'},
      {id:3, user: 'Guillaume Docquier', title: 'My Other Favorite Thingy', description: 'Please take care of it as well'}
    ];

    // Returns all posts made
    function all(){
      //For testing only
      return vm.testValues
    }

    // Gets posts made by a user
    function get(user){
      // For testing only
      var results = [];
      console.log('user: ' + user);
      for(var i = 0; i < vm.testValues.length; i++){
        if(vm.testValues[i].user == user) results.push(vm.testValues[i]);
      }
      return results;
    }

    // Creates a new post
    function create(user, title, description){
      // For testing only
      vm.testValues.push({id:vm.testValues.length, user:user, title:title, description:description});
      return vm.testValues;
    }

    function remove(id){
      // For testing only
      vm.testValues.splice(id,1);
      return vm.testValues;
    }
  }
})();
