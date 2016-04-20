(function(){
  'use strict'

  angular
    .module('thingy.posts.controllers')
    .controller('ThingiesController', ThingiesController);

  ThingiesController.$inject = ['$rootScope', '$scope', 'Authentication', 'Thingies', '$route', '$cookies', '$location'];

  function ThingiesController($rootScope, $scope, Authentication, Thingies, $route, $cookies, $location) {
    var vm = this;

    vm.isAuthenticated = Authentication.isAuthenticated();
    vm.posts = [];
    vm.create = create;
    vm.categories = [];
    vm.regions = [];
    activate();

    function activate() {
      Thingies.allPosts().then(postsSuccessFn, postsErrorFn);
      Thingies.allCategories().then(categoriesSuccessFn, categoriesErrorFn);
      Thingies.allRegions().then(regionsSuccessFn, regionsErrorFn);

      restoreForms();
      bindEvents();

      /* Prompts the user on refresh
      window.onbeforeunload = function (e) {
        console.log("Refresh");
        return "Are you sure?";
      };*/

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
        alert(data.error);
      }

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
        var tabId = $location.hash();
        var savedForm = $cookies.getObject('savedForm');
        if (!jQuery.isEmptyObject(tabId))
        {
          // Tabs
          $(".nav-tabs li").removeClass("active");
          $("#" + tabId + "-tab").addClass("active");
          // Panes
          $(".tab-pane").removeClass("in active");
          $("#" + tabId).addClass("in active");
        }
        if (savedForm)
        {
          // Forms
          vm.search = savedForm.search;
          vm.title = savedForm.title;
          vm.description = savedForm.description;
          vm.username = savedForm.username;
          vm.price = savedForm.price;
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
              search: vm.search,
              title: vm.title,
              description: vm.description,
              price: vm.price,
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


    function create() {
      Thingies.create(vm.title, vm.description, vm.price, vm.category, vm.subcategory, vm.region, vm.subregion).then(createPostSuccessFn, createPostErrorFn);

      /**
      * @name createPostSuccessFn
      * @desc Show snackbar with success message
      */
      function createPostSuccessFn(data, status, headers, config) {
        resetForms();
        $route.reload();
      }

      /**
      * @name createPostErrorFn
      * @desc Propogate error event and show snackbar with error message
      */
      function createPostErrorFn(data, status, headers, config) {
        alert('You need to log in first... I could open the login window instead.');
      };
    }

    function resetForms() {
      vm.find = vm.title = vm.description = vm.price = vm.category = vm.subcategory = vm.region = vm.subregion = "";
    }
  }
})();
