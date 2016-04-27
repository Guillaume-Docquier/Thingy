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
    function add(title, description, price, conditionID, subcategoryID, subregionID, image) {
      console.log('image: ' + image);
      return $http.post('/api/v1/posts/', {
        title: title,
        description: description,
        price: price,
        condition: conditionID,
        subcategory: subcategoryID,
        location: subregionID,
        image: image
      });
    }

    // Gets posts made by a user
    function getUserPosts(username) {
      return $http.get('/api/v1/accounts/' + username + '/posts/');
    }

    // TODO
    // Searches for Thingies in the db
    function search(author, title, description, category, subcategory, minPrice, maxPrice, region, subregion, condition) {
      var query, argumentNames, i, j;

      query = '?';
      argumentNames = [
        'author__username',
        'title',
        'description',
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

      // The 3 first arguments are always the same
      // We want to use them to search for author, title OR description
      /*if(arguments[0])
      {
        for(; i < 3; i++)
        {
          query += (argumentNames[i] + '=' + arguments[i]);
          if (i == 2) query += '&';
          else query += '|';
        }
      }*/

      // Rest of the arguments must match exactly
      for(; i < j; i++)
      {
        console.log(argumentNames[i] + ': ' + JSON.stringify(arguments[i]));
        if(arguments[i])
        {
          query += (argumentNames[i] + '=' + arguments[i] + '&');
        }
      }
      return $http.get('/api/v1/posts/' + query);
    }
  }
})();
