(function(){
  'use strict'

  angular
    .module('thingy.posts.services')
    .service('Thingies', Thingies);

  Thingies.$inject = ['$http'];

  function Thingies($http) {
    var vm = this;

    vm.allPosts = allPosts;
    vm.allCategories = allCategories;
    vm.create = create;
    vm.get = get;

    // Returns all posts made
    function allPosts() {
      return $http.get('/api/v1/posts/');
    }

    // Returns all categories
    function allCategories() {
      return $http.get('/api/v1/categories/');
    }

    // Creates a new post
    function create(title, description, price) {
      return $http.post('/api/v1/posts/', {
        title: title, description: description, price: price
      });
    }

    // Gets posts made by a user
    function get(username) {
      return $http.get('/api/v1/accounts/' + username + '/posts/');
    }
  }
})();