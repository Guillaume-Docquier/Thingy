(function (){
  'use strict'

  angular
    .module('thingy.posts.controllers')
    .controller('UpdateController', UpdateController);

  UpdateController.$inject = ['$rootScope', '$scope', 'Authentication', '$route', '$cookies', '$location', 'Posts', '$routeParams'];

  function UpdateController($rootScope, $scope, Authentication, $route, $cookies, $location, Posts, $routeParams) {
    var vm = this;

    // Functions and Data
    vm.destroy = destroy;
    vm.update = update;
    vm.categories = [];
    vm.regions = [];
    vm.conditions = [];
    vm.imageDisplay = '';
    vm.imageUpload = '';

    // Bindings, empty string to prevent unwanted behaviour
    vm.post = '';
    vm.condition = '';
    vm.category = '';
    vm.subcategory = '';
    vm.region = '';
    vm.subregion = '';

    activate();

    function activate() {
      if (!Authentication.isAuthenticated())
        $location.url('/');
      Posts.getAllCategories().then(categoriesSuccessFn, categoriesErrorFn);
      Posts.getAllRegions().then(regionsSuccessFn, regionsErrorFn);
      Posts.getAllConditions().then(conditionsSuccessFn, conditionsErrorFn);

      var thingyId = $routeParams.postid;
      Posts.getSinglePost(thingyId).then(postSuccessFn, postErrorFn);

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

      function postSuccessFn(data) {
        if (Authentication.getAuthenticatedAccount().id != data.data.author.id)
          $location.url('/');
        vm.post = data.data;
        vm.imageDisplay = 'media/' + vm.post.image;

        vm.region = findObjectContainingKey(vm.regions, 'name', vm.post.location_details.region.name);
        vm.subregion = findObjectContainingKey(vm.region.towns, 'name', vm.post.location_details.name);
        vm.category = findObjectContainingKey(vm.categories, 'cname', vm.post.subcategory_details.category.cname);
        vm.subcategory = findObjectContainingKey(vm.category.subcategories, 'name', vm.post.subcategory_details.sub_cat_name);
        vm.condition = findObjectContainingKey(vm.conditions, 'cond_desc', vm.post.condition_details.cond_desc);

        // Finds which object contains value as key.
        function findObjectContainingKey(objects, key, value) {
          for(var i = 0; i < objects.length; i++)
          {
            if(objects[i][key].toLowerCase() == value.toLowerCase())
              return objects[i];
          }
          return '';
        }
      }

      function postErrorFn(data) {
        alert('Could not retrieve post');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }

    function update() {
      if (Authentication.isAuthenticated())
      {
        Posts.update(
          vm.post.id,
          vm.post.title,
          vm.post.description,
          vm.post.price,
          vm.condition.id,
          vm.subcategory.id,
          vm.subregion.id,
          vm.imageUpload.base64
        ).then(updatePostSuccessFn, updatePostErrorFn);
      }
      else alert('You need to log in first');

      /**
      * @name createPostSuccessFn
      * @desc Show snackbar with success message
      */
      function updatePostSuccessFn(data) {
        alert('Post updated!');
        $location.url('/thingies/details/' + vm.post.id);
      }

      /**
      * @name createPostErrorFn
      * @desc Propogate error event and show snackbar with error message
      */
      function updatePostErrorFn(data) {
        alert('Could not update post.');
        console.error('Error: ' + JSON.stringify(data.data));
      };
    }

    function destroy() {

    }
  }
})();
