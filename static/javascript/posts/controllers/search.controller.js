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

    // Bindings
    vm.searchTerm = '';
    vm.category = '';
    vm.subcategory = '';
    vm.minPrice = '';
    vm.maxPrice = '';
    vm.region = '';
    vm.subregion = '';
    vm.condition = '';

    activate();

    function activate() {
      Posts.getAllPosts().then(postsSuccessFn, postsErrorFn);
      Posts.getAllCategories().then(categoriesSuccessFn, categoriesErrorFn);
      Posts.getAllRegions().then(regionsSuccessFn, regionsErrorFn);
      Posts.getAllConditions().then(conditionsSuccessFn, conditionsErrorFn);

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
      /**
      * @name postsSuccessFn
      * @desc Update posts array on view
      */
      function postsSuccessFn(data, status, headers, config) {
        vm.posts = data.data;
      }

      /**
      * @name postsErrorFn
      * @desc Show snackbar with error
      */
      function postsErrorFn(data, status, headers, config) {
        alert(data.statusText);
        console.log(data);
      }
    }

    // TODO
    function search() {
      Posts.search(
        vm.author,  // Author
        vm.title,  // Title
        vm.description,  // Description
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
  }
})();
