/**
* Posts
* @namespace thingy.posts.services
*/
(function(){
  'use strict'

  angular
    .module('thingy.posts.services')
    .service('Posts', Posts);

  Posts.$inject = ['$http', 'Authentication'];

  /**
  * @namespace Posts
  */
  function Posts($http, Authentication) {
    var vm = this;

    vm.getAllCategories = getAllCategories;
    vm.getAllRegions = getAllRegions;
    vm.getAllConditions = getAllConditions;
    vm.add = add;
    vm.update = update;
    vm.deletePost = deletePost;
    vm.getAllPosts = getAllPosts;
    vm.getSinglePost = getSinglePost;
    vm.getUserPosts = getUserPosts;
    vm.search = search;
    vm.rent = rent;

    /**
    * @name getAllPosts
    * @desc Retrieve all posts
    * @returns {Promise}
    * @memberOf thingy.posts.services.Posts
    */
    function getAllPosts() {
      return $http.get('/api/v1/posts/');
    }

    /**
    * @name getAllCategories
    * @desc Retrieve all categories
    * @returns {Promise}
    * @memberOf thingy.posts.services.Posts
    */
    function getAllCategories() {
      return $http.get('/api/v1/categories/');
    }

    /**
    * @name getAllRegions
    * @desc Retrieve all regions
    * @returns {Promise}
    * @memberOf thingy.posts.services.Posts
    */
    function getAllRegions() {
      return $http.get('/api/v1/regions/');
    }

    /**
    * @name getAllConditions
    * @desc Retrieve all conditions
    * @returns {Promise}
    * @memberOf thingy.posts.services.Posts
    */
    function getAllConditions() {
      return $http.get('/api/v1/conditions/');
    }

    /**
    * @name add
    * @desc Create a new post
    * @param {String} title The title of the post
    * @param {String} description The description of the post
    * @param {Number} price The price of the post
    * @param {Number} conditionID The condition of the post
    * @param {Number} subcategoryID The subcategory of the post
    * @param {Number} subregionID The subregion of the post
    * @param {String} areaCode The area code of the post
    * @param {base64 String} image64 The image of the post
    * @returns {Promise}
    * @memberOf thingy.posts.services.Posts
    */
    function add(title, description, price, conditionID, subcategoryID, subregionID, areaCode, image64) {
      return $http.post('/api/v1/posts/', {
        title: title,
        description: description,
        price: price,
        condition: conditionID,
        subcategory: subcategoryID,
        location: subregionID,
        area_code: areaCode,
        image: image64
      });
    }

    /**
    * @name update
    * @desc Update a post
    * @param {Number} id The id of the post to update
    * @param {String} title The new title of the post
    * @param {String} description The new description of the post
    * @param {Number} price The new price of the post
    * @param {Number} conditionID The new condition of the post
    * @param {Number} subcategoryID The new subcategory of the post
    * @param {Number} subregionID The new subregion of the post
    * @param {String} areaCode The new area code of the post
    * @param {base64 String} image64 The new image of the post
    * @returns {Promise}
    * @memberOf thingy.posts.services.Posts
    */
    function update(id, title, description, price, conditionID, subcategoryID, subregionID, areaCode, image64) {
      return $http.put('/api/v1/posts/' + id + '/', {
        title: title,
        description: description,
        price: price,
        condition: conditionID,
        subcategory: subcategoryID,
        location: subregionID,
        area_code: areaCode,
        image: image64
      });
    }

    /**
    * @name deletePost
    * @desc Delete a post
    * @param {Number} postId The id of the post to be deleted
    * @returns {Promise}
    * @memberOf thingy.posts.services.Posts
    */
    function deletePost(postId) {
      return $http.delete('api/v1/posts/' + postId + '/');
    }

    /**
    * @name getSinglePost
    * @desc Retrieves a post
    * @param {Number} postId The id of the post to be retrieved
    * @returns {Promise}
    * @memberOf thingy.posts.services.Posts
    */
    function getSinglePost(postId) {
      return $http.get('/api/v1/posts/' + postId + '/');
    }

    /**
    * @name getUserPosts
    * @desc Retrieves all post a user has
    * @param {String} username The username of the user we want the posts
    * @returns {Promise}
    * @memberOf thingy.posts.services.Posts
    */
    function getUserPosts(username) {
      return $http.get('/api/v1/accounts/' + username + '/posts/');
    }

    /**
    * @name search
    * @desc Searches for posts matching the requirements
    * @param {String} search A term to be searched for in the description or title
    * @param {String} category The category of the posts
    * @param {String} subcategory The subcategory of the posts
    * @param {Number} minPrice The minimum price for the posts
    * @param {Number} maxPrice The maximum price for the posts
    * @param {String} region The region of the posts
    * @param {String} subregion The subregion of the posts
    * @param {String} condition the contition of the posts
    * @returns {Promise}
    * @memberOf thingy.posts.services.Posts
    */
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

    /**
    * @name rent
    * @desc Send a rent request/reply (request,accept,decline)
    * @param {String} status The status of the request
    * @param {String} data The data to be sent
    * @returns {Promise}
    * @memberOf thingy.posts.services.Posts
    */
    function rent(status, data) {
      switch (status)
      {
        case 'request':
          console.log(typeof data.postId);
          return $http.post('api/v1/requests/', {
            start_date: data.period.start,
            end_date: data.period.end,
            body: data.message,
            rentee: Authentication.getAuthenticatedAccount().id,
            thingy: data.postId
          });
        case 'accept':
          return $http.put('api/v1/requests/' + data.request.id + '/', {
            thingy: data.request.thingy,
            start_date: data.request.start_date,
            end_date: data.request.end_date,
            status: 'Accepted'
          });
        case 'decline':
          return $http.put('api/v1/requests/' + data.request.id + '/', {
            thingy: data.request.thingy,
            start_date: data.request.start_date,
            end_date: data.request.end_date,
            status: 'Declined'
          });
      }

    }
  }
})();
