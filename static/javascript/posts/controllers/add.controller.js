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
    vm.imageUpload = '';

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


      function bindEvents() {
        // Live preview of the uploaded image
        $scope.$watch(function() { return vm.imageUpload }, function() {
          if (vm.imageUpload)
          {
            var src = 'data:' + vm.imageUpload.filetype + ';base64,' + vm.imageUpload.base64;
            $('#camera').attr('src', src);
          }
        });
      }
      function categoriesSuccessFn(data, status, headers, config) {
        vm.categories = data.data;
      }

      function categoriesErrorFn(data) {
        alert('Could not load categories.');
        console.error('Error: ' + JSON.stringify(data.data));
      }

      function regionsSuccessFn(data, status, headers, config) {
        vm.regions = data.data;
      }

      function regionsErrorFn(data) {
        alert('Could not load regions.');
        console.error('Error: ' + JSON.stringify(data.data));
      }

      function conditionsSuccessFn(data, status, headers, config) {
        vm.conditions = data.data;
      }

      function conditionsErrorFn(data) {
        alert('Could not load conditions.');
        console.error('Error: ' + JSON.stringify(data.data));
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
          vm.imageUpload.base64
        ).then(addPostSuccessFn, addPostErrorFn);
      }
      else alert('You need to log in first');

      /**
      * @name createPostSuccessFn
      * @desc Show snackbar with success message
      */
      function addPostSuccessFn(data, status, headers, config) {
        alert('Post created!');
        $location.url('/thingies/details/' + data.data.id);
      }

      /**
      * @name createPostErrorFn
      * @desc Propogate error event and show snackbar with error message
      */
      function addPostErrorFn(data) {
        alert('Could not add post.');
        console.error('Error: ' + JSON.stringify(data.data));
      };
    }
  }
})();
