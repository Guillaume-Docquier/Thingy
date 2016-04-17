(function(){
  'use strict'

  angular
    .module('thingy.posts.services')
    .service('Thingies', Thingies);

  Thingies.$inject = ['$http'];

  function Thingies($http) {
    var vm = this;

    vm.all = all;
    vm.create = create;
    vm.get = get;

    // Returns all posts made
    function all() {
      return $http.get('/api/v1/posts/');
    }

    // Creates a new post
    function create(title, description) {
      return $http.post('/api/v1/posts/', {
        title: title, description: description
      });
    }

    // Gets posts made by a user
    function get(username) {
      return $http.get('/api/v1/accounts/' + username + '/posts/');
    }
  }
})();
