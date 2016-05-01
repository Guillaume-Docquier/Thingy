(function (){
  'use strict'

  angular
    .module('thingy.posts.controllers')
    .controller('AddController', AddController);

  AddController.$inject = ['$rootScope', '$scope', 'Authentication', '$route', '$cookies', '$location', 'Posts'];

  function AddController($rootScope, $scope, Authentication, $route, $cookies, $location, Posts) {
    var vm = this;

    // Functions and Data
    vm.add = add;
    vm.categories = [];
    vm.regions = [];
    vm.conditions = [];
    vm.imageUpload;

    // Bindings, empty string to prevent unwanted behaviour
    vm.title;
    vm.description;
    vm.price;
    vm.condition = '';
    vm.category = '';
    vm.subcategory = '';
    vm.region = '';
    vm.subregion = '';

    activate();

    function activate() {
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
    }

    function add() {
      console.log(vm.imageUpload);
      if (Authentication.isAuthenticated())
      {
        Posts.add(
          vm.title,
          vm.description,
          vm.price,
          vm.condition.id,
          vm.subcategory.id,
          vm.subregion.id,
          vm.imageUpload
        ).then(addPostSuccessFn, addPostErrorFn);
      }
      else alert('You need to log in first');

      /**
      * @name createPostSuccessFn
      * @desc Show snackbar with success message
      */
      function addPostSuccessFn(data, status, headers, config) {
        $route.reload();
        alert('Post created!');
      }

      /**
      * @name createPostErrorFn
      * @desc Propogate error event and show snackbar with error message
      */
      function addPostErrorFn(data, status, headers, config) {
        alert('Ooops, you entered wrong information.');
        console.log(data);
      };
    }
  }
})();
