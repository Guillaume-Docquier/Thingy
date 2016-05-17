(function(){
  'use strict'

  angular
    .module('thingy.posts.services')
    .service('Posts', Posts);

  Posts.$inject = ['$http'];

  function Posts($http) {
    var vm = this;

    vm.getAllCategories = getAllCategories;
    vm.getAllRegions = getAllRegions;
    vm.getAllConditions = getAllConditions;
    vm.add = add;
    vm.update = update;
    vm.getAllPosts = getAllPosts;
    vm.getSinglePost = getSinglePost;
    vm.getUserPosts = getUserPosts;
    vm.search = search;
    vm.rent = rent;

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
    function add(title, description, price, conditionID, subcategoryID, subregionID, image64) {
      return $http.post('/api/v1/posts/', {
        title: title,
        description: description,
        price: price,
        condition: conditionID,
        subcategory: subcategoryID,
        location: subregionID,
        image: image64
      });
    }

    // Updates a post
    function update(id, title, description, price, conditionID, subcategoryID, subregionID, image64) {
      return $http.put('/api/v1/posts/' + id + '/', {
        title: title,
        description: description,
        price: price,
        condition: conditionID,
        subcategory: subcategoryID,
        location: subregionID,
        image: image64
      });
    }

    // Gets a post by its ID
    function getSinglePost(id) {
      return $http.get('/api/v1/posts/' + id + '/');
    }

    // Gets posts made by a user
    function getUserPosts(username) {
      return $http.get('/api/v1/accounts/' + username + '/posts/');
    }

    // Searches for Thingies in the db
    function search(search, category, subcategory, minPrice, maxPrice, region, subregion, condition) {
      var query, argumentNames, i, j;

      query = '?';
      // Use argumentNames to match db fields
      argumentNames = [
        'search',
        'subcategory__category__cname',
        'subcategory__sub_cat_name',
        'min_price',
        'max_price',
        'location__region__name',
        'location__name',
        'condition__cond_desc'
      ];
      i = 0;
      j = arguments.length;

      // Loop through arguments and create a query string
      for(; i < j; i++)
      {
        if(arguments[i])
        {
          query += (argumentNames[i] + '=' + arguments[i] + '&');
        }
      }
      // Remove the last character
      query = query.slice(0, -1);
      return $http.get('/api/v1/posts/' + query);
    }

    // Sends a rent request/reply (request,accept,decline)
    function rent(userId, postId, request, period, message) {
      return $http.post('api/v1/posts/' + postId + '/rent/', {
        userId: userId,
        request: request,
        period: JSON.stringify(period),
        message: message
      });
    }
  }
})();
