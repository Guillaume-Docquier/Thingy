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
    vm.search = search;

    // Bindings
    vm.searchTerm;
    vm.category;
    vm.subcategory;
    vm.minPrice;
    vm.maxPrice;
    vm.region;
    vm.subregion;
    vm.condition;

    activate();

    function activate() {
      Posts.getAllPosts().then(postsSuccessFn, postsErrorFn);

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
      alert('Ooops, you got me! This is not ready yet.');
      //Posts.search(vm.searchTerm);
    }
  }
})();
