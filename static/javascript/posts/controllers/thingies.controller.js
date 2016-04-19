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
    activate();

    function activate() {
      Thingies.allPosts().then(postsSuccessFn, postsErrorFn);
      Thingies.allCategories().then(categoriesSuccessFn, categoriesErrorFn);
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
        restoreForms();
      }

      function categoriesErrorFn(data, status, headers, config) {
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
          //vm.subcategory = JSON.parse(savedForm.subcategory); // Working weird
          //vm.category = JSON.parse(savedForm.category); // Working weird
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
              // category: JSON.stringify(vm.category), // Working weird
              // subcategory: JSON.stringify(vm.subcategory) // Working weird
            }, {expires: new Date(Date.now() + 2000)} // valid for 2 seconds
          );
        });
      }
    }


    function create() {
      Thingies.create( vm.description, vm.title, vm.price, vm.category).then(createPostSuccessFn, createPostErrorFn);

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
        alert('Ooops...');
      };
    }

    function resetForms() {
      vm.find = vm.title = vm.description = vm.price = vm.category = vm.subcategory = "";
    }
  }
})();
