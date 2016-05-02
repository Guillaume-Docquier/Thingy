(function(){
  'use strict'

  angular
    .module('thingy.posts.controllers')
    .controller('SearchController', SearchController);

  SearchController.$inject = ['$rootScope', '$scope', 'Posts', '$route', '$cookies', '$location'];

  function SearchController($rootScope, $scope, Posts, $route, $cookies, $location) {
    var vm = this;

    // Function and Data
    vm.posts = [];
    vm.categories = [];
    vm.regions = [];
    vm.conditions = [];
    vm.search = search;
    vm.selection = selection;
    vm.advanced = ($location.search().advanced == 'true');

    // Bindings
    // Empty strings to prevent errors due to undefined values
    vm.searchTerm = $location.search().search;
    vm.category = '';
    vm.subcategory = '';
    vm.minPrice = '';
    vm.maxPrice = '';
    vm.region = '';
    vm.subregion = '';
    vm.condition = '';
    vm.selectedPost;
    vm.geoloc = '';

    activate();

    function activate() {
      // Get db data
      Posts.getAllCategories().then(categoriesSuccessFn, categoriesErrorFn);
      Posts.getAllRegions().then(regionsSuccessFn, regionsErrorFn);
      Posts.getAllConditions().then(conditionsSuccessFn, conditionsErrorFn);

      // This will search as specified in the url or return all posts
      vm.search();

      function categoriesSuccessFn(data, status, headers, config) {
        vm.categories = data.data;
      }

      function categoriesErrorFn(data, status, headers, config) {
        alert(data.data.error);
      }

      function regionsSuccessFn(data, status, headers, config) {
        vm.regions = data.data;
      }

      function regionsErrorFn(data, status, headers, config) {
        alert(data.data.error);
      }

      function conditionsSuccessFn(data, status, headers, config) {
        vm.conditions = data.data;
      }

      function conditionsErrorFn(data, status, headers, config) {
        alert(data.data.error);
      }
    }

    function search() {
      console.log('Searching...');
      Posts.search(
        vm.searchTerm,  // Matches Title or Description
        vm.category.cname,
        vm.subcategory.name,
        vm.minPrice,
        vm.maxPrice,
        vm.region.name,
        vm.subregion.name,
        vm.condition.cond_desc
      ).then(searchSuccessFn, searchErrorFn);

      /**
      * @name postsSuccessFn
      * @desc Update posts array on view
      */
      function searchSuccessFn(data, status, headers, config) {
        vm.posts = data.data;
      }

      /**
      * @name postsErrorFn
      * @desc Show snackbar with error
      */
      function searchErrorFn(data, status, headers, config) {
        alert(data.statusText);
        console.log(data);
      }
    }

    function selection(thingy) {
      vm.selectedPost = thingy;
      vm.geoloc = thingy.subregion.name
    }
  }
})();
