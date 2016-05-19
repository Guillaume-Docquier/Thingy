/**
* UsersController
* @namespace thingy.profiles.controllers
*/
(function(){
  'use strict'

  angular
    .module('thingy.profiles.controllers')
    .controller('UsersController', UsersController);

  UsersController.$inject = ['$scope', '$location', '$routeParams', 'Profile', 'Posts', 'Message', 'Authentication'];

  /**
  * @namespace UsersController
  */
  function UsersController($scope, $location, $routeParams, Profile, Posts, Message, Authentication) {
    var vm = this;

    // Functions and data
    vm.createReview = createReview;
    vm.isOwner = false;
    vm.isAuthenticated = Authentication.isAuthenticated();
    vm.profile = '';
    vm.posts = [];
    vm.reviews = [];
    vm.ratings = [1,2,3,4,5]

    // Bindings
    vm.description = '';
    vm.rating = '';

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf thingy.profiles.controllers.UsersController
    */
    function activate() {
      // Needed for public profiles
      var username = $routeParams.username;

      // There's a bug if username contains a dot.
      if (username.match(/\./))
      {
        $location.url('/');
        return;
      }

      // Reroute if own profile
      if (vm.isAuthenticated && username == Authentication.getAuthenticatedAccount().username)
      {
        $location.url('/profile');
        return;
      }

      Profile.get(username).then(profileSuccessFn, profileErrorFn);

      /**
      * @name profileSuccessProfile
      * @desc Update 'profile' on viewmodel
      */
      function profileSuccessFn(data) {
        vm.profile = data.data;
        Posts.getUserPosts(vm.profile.username).then(postsSuccessFn, postsErrorFn);
        Profile.getReviews(vm.profile.id).then(reviewsSuccessFn, reviewsErrorFn);

        /**
          * @name postsSucessFn
          * @desc Update 'posts' on viewmodel
          */
        function postsSuccessFn(data, status, headers, config) {
          vm.posts = data.data;
        }

        /**
          * @name postsErrorFn
          * @desc Log error in the console
          */
        function postsErrorFn(data) {
          alert('Could not load posts.');
          console.error('Error: ' + JSON.stringify(data.data));
        }

        /**
          * @name postsSucessFn
          * @desc Update 'posts' on viewmodel
          */
        function reviewsSuccessFn(data) {
          vm.reviews = data.data;
          for(var i = 0; i < vm.reviews.length; i++) {
            vm.reviews[i].created = moment(vm.reviews[i].created).format('MMMM Do HH:mm');
          }
        }

        /**
          * @name postsErrorFn
          * @desc Log error in the console
          */
        function reviewsErrorFn(data) {
          alert('Could not load reviews.');
          console.error('Error: ' + JSON.stringify(data.data));
        }
      }

      /**
      * @name profileErrorFn
      * @desc Redirect to index and log error in the console
      */
      function profileErrorFn(data) {
        $location.url('/');
        alert('Could not load profile.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }

    /**
    * @name createReview
    * @desc Create a review
    */
    function createReview() {
      Profile.createReview(
        vm.profile.id,
        vm.description,
        vm.rating
      ).then(reviewSuccessFn, reviewErrorFn);

      /**
      * @name reviewSuccessFn
      * @desc Notifiy of success
      */
      function reviewSuccessFn(data) {
        alert('Review created!');
      }

      /**
      * @name reviewErrorFn
      * @desc Notify of error and log it in the console
      */
      function reviewErrorFn() {
        alert('Could not create the review.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }
  }
})();
