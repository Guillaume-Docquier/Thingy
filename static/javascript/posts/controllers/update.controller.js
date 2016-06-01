(function (){
  'use strict'

  angular
    .module('thingy.posts.controllers')
    .controller('UpdateController', UpdateController);

  UpdateController.$inject = ['$rootScope', '$scope', 'Authentication', '$route', '$cookies', '$location', 'Posts', '$routeParams'];

  function UpdateController($rootScope, $scope, Authentication, $route, $cookies, $location, Posts, $routeParams) {
    var vm = this;

    // Functions and Data
    vm.deletePost = deletePost;
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

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf thingy.posts.controllers.UpdateController
    */
    function activate() {
      if (!Authentication.isAuthenticated())
        $location.url('/');
      Posts.getAllCategories().then(categoriesSuccessFn, categoriesErrorFn);
      Posts.getAllRegions().then(regionsSuccessFn, regionsErrorFn);
      Posts.getAllConditions().then(conditionsSuccessFn, conditionsErrorFn);

      var thingyId = $routeParams.postid;
      Posts.getSinglePost(thingyId).then(postSuccessFn, postErrorFn);

      bindEvents();


      /**
      * @name bindEvents
      * @desc Bind various events
      */
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

      /**
      * @name categoriesSuccessFn
      * @desc Update 'categories' view model
      */
      function categoriesSuccessFn(data, status, headers, config) {
        vm.categories = data.data;
      }

      /**
      * @name categoriesErrorFn
      * @desc Log error to console
      */
      function categoriesErrorFn(data) {
        alert('Could not load categories.');
        console.error('Error: ' + JSON.stringify(data.data));
      }

      /**
      * @name regionsSuccessFn
      * @desc Update 'regions' view model
      */
      function regionsSuccessFn(data, status, headers, config) {
        vm.regions = data.data;
      }

      /**
      * @name regionsErrorFn
      * @desc Log error to console
      */
      function regionsErrorFn(data) {
        alert('Could not load regions.');
        console.error('Error: ' + JSON.stringify(data.data));
      }

      /**
      * @name conditionsSuccessFn
      * @desc Update 'conditions' view model
      */
      function conditionsSuccessFn(data, status, headers, config) {
        vm.conditions = data.data;
      }

      /**
      * @name conditionsErrorFn
      * @desc Log error to console
      */
      function conditionsErrorFn(data) {
        alert('Could not load conditions.');
        console.error('Error: ' + JSON.stringify(data.data));
      }

      /**
      * @name postSuccessFn
      * @desc Load message data if we are the author
      */
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

      /**
      * @name postErrorFn
      * @desc Log error to console
      */
      function postErrorFn(data) {
        alert('Could not retrieve post.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }

    /**
    * @name update
    * @desc Update the post
    */
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
          vm.post.area_code,
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
      * @name updatePostErrorFn
      * @desc Log error to console
      */
      function updatePostErrorFn(data) {
        alert('Could not update post.');
        console.error('Error: ' + JSON.stringify(data.data));
      };
    }

    /**
    * @name deletePost
    * @desc Delete the post
    */
    function deletePost() {
      Posts.deletePost(vm.post.id).then(deleteSuccessFn, deleteErrorFn);

      /**
      * @name deleteSuccessFn
      * @desc Redirect to profile page
      */
      function deleteSuccessFn(data) {
        alert('Post deleted!');
        $location.url('/profile');
      }

      /**
      * @name deleteErrorFn
      * @desc Log error to console
      */
      function deleteErrorFn(data) {
        alert('Could not delete post.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }
  }
})();
