(function(){
  'use strict'

  angular
    .module('thingy.posts.services')
    .service('Posts', Posts);

  Posts.$inject = ['$http'];

  function Posts($http) {
    var vm = this;

    vm.getAllPosts = getAllPosts;
    vm.getAllCategories = getAllCategories;
    vm.getAllRegions = getAllRegions;
    vm.getAllConditions = getAllConditions;
    vm.add = add;
    vm.getUserPosts = getUserPosts;
    vm.search = search;

    // Returns all posts made
    function getAllPosts() {
      return $http.get('/api/v1/posts/');
    }

    // Returns all categories
    function getAllCategories() {
      return $http.get('/api/v1/categories/');
    }

    // Returns all regions
    function getAllRegions() {
      return $http.get('/api/v1/regions/');
    }

    // Returns all regions
    function getAllConditions() {
      return $http.get('/api/v1/conditions/');
    }

    // Adds a new post
    function add(title, description, price, conditionId, subcategoryId, subregionId) {
      return $http.post('/api/v1/posts/', {
        title: title,
        description: description,
        price: price,
        condition: conditionId,
        subcategory: subcategoryId,
        location: subregionId
      });
    }

    // Gets posts made by a user
    function getUserPosts(username) {
      return $http.get('/api/v1/accounts/' + username + '/posts/');
    }

    // TODO
    // Searches for Thingies in the db
    function search() {
      return $http.get();
    }
  }
})();
