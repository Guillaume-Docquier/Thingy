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

      bindEvents();
      // Not useful right now
      restoreForms();

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

      function restoreForms() {
        var savedForm = $cookies.getObject('savedForm');
        if (savedForm)
        {
          // Forms
          vm.title = savedForm.title;
          vm.description = savedForm.description;
          vm.price = savedForm.price;
          vm.condition = savedForm.condition;
          // TODO
          //vm.category = JSON.parse(savedForm.category); // Working weird
          //vm.subcategory = JSON.parse(savedForm.subcategory); // Working weird
          //vm.region = JSON.parse(savedForm.region); // Working weird
          //vm.subregion = JSON.parse(savedForm.subregion); // Working weird
          // Actions
          //if (searchObject.action) vm.search();
        }
      }

      function bindEvents() {
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
        //$route.reload();
      }

      /**
      * @name createPostErrorFn
      * @desc Propogate error event and show snackbar with error message
      */
      function addPostErrorFn(data, status, headers, config) {
        alert('Something went wrong, check the console.');
        console.log(data);
      };
    }
  }
})();
