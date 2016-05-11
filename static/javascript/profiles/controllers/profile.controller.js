(function(){
  'use strict'

  angular
    .module('thingy.profiles.controllers')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$scope', '$location', '$routeParams', 'Profile', 'Posts'];

  /**
  * @namespace ProfileController
  */
  function ProfileController($scope, $location, $routeParams, Profile, Posts) {
    var vm = this;

    vm.profile = undefined;
    vm.messages = [
      {
        author: {username:'gudoc'},
        body: 'Wassup bro'
      },
      {
        author: {username:'gudoc'},
        body: 'Wrong person'
      }
    ];
    vm.posts = [];

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf thingy.profiles.controllers.ProfileController
    */
    function activate() {
      var username = $routeParams.username;

      // Prevents a bug where Profile.get("something.something") returns index.html's code...
      if (username.match(/\./)) {
        window.location = '/';
        return;
      }

      Profile.get(username).then(profileSuccessFn, profileErrorFn);
      Posts.getUserPosts(username).then(postsSuccessFn, postsErrorFn);

      /**
      * @name profileSuccessProfile
      * @desc Update 'profile' on viewmodel
      */
      function profileSuccessFn(data, status, headers, config) {
        vm.profile = data.data;
      }

      /**
      * @name profileErrorFn
      * @desc Redirect to index and log error in the console
      */
      function profileErrorFn(data, status, headers, config) {
        $location.url('/');
        console.log("Error loading profile");
      }

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
      function postsErrorFn(data, status, headers, config) {
        console.log("Error loading Thingies");
      }
    }
  }
})();
