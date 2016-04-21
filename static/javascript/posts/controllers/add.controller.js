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

    // Bindings
    vm.title;
    vm.description;
    vm.price;
    vm.condition;
    vm.category;
    vm.subcategory;
    vm.region;
    vm.subregion;

    activate();

    function activate() {
      Posts.getAllCategories().then(categoriesSuccessFn, categoriesErrorFn);
      Posts.getAllRegions().then(regionsSuccessFn, regionsErrorFn);

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
        // Save form on refresh
        $rootScope.$on('login', function (event, post) {
          $cookies.putObject('savedForm', {
              title: vm.title,
              description: vm.description,
              price: vm.price,
              condition: vm.condition,
              // TODO
              // category: JSON.stringify(vm.category), // Working weird
              // subcategory: JSON.stringify(vm.subcategory) // Working weird
              // category: JSON.stringify(vm.region), // Working weird
              // subcategory: JSON.stringify(vm.subregion) // Working weird
            }, {expires: new Date(Date.now() + 2000)} // valid for 2 seconds
          );
        });
      }
    }

    function add() {
      if (Authentication.isAuthenticated())
        Posts.add(
          vm.title,
          vm.description,
          vm.price,
          vm.condition.id,
          vm.subcategory.id,
          vm.subregion.id
        ).then(addPostSuccessFn, addPostErrorFn);
      else alert('You need to log in first');

      /**
      * @name createPostSuccessFn
      * @desc Show snackbar with success message
      */
      function addPostSuccessFn(data, status, headers, config) {
        resetForms();
        $route.reload();
      }

      /**
      * @name createPostErrorFn
      * @desc Propogate error event and show snackbar with error message
      */
      function addPostErrorFn(data, status, headers, config) {
        alert('You need to log in first... I could open the login window instead.');
      };
    }

    function resetForms() {
      vm.title =
      vm.description =
      vm.price =
      vm.category =
      vm.subcategory =
      vm.region =
      vm.subregion =
      "";
    }
  }
})();
