/**
* SettingsController
* @namespace thingy.profiles.controllers
*/
(function () {
  'use strict';

  angular
    .module('thingy.profiles.controllers')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = [
    '$location', '$scope', '$routeParams', 'Authentication', 'Profile', '$route',
  ];

  /**
  * @namespace SettingsController
  */
  function SettingsController($location, $scope, $routeParams, Authentication, Profile, $route) {
    var vm = this;

    // Functions and Data
    vm.destroy = destroy;
    vm.update = update;
    vm.imageDisplay = '';

    // Bindings
    vm.profile;
    vm.imageUpload = '';

    activate();


    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated.
    * @memberOf thingy.profiles.controllers.SettingsController
    */
    function activate() {
      var authenticatedAccount = Authentication.getAuthenticatedAccount();
      var username = $routeParams.username;

      // Redirect if not logged in
      if (!authenticatedAccount) {
        $location.url('/');
        alert('You are not authorized to view this page.');
        return;
      }
      else {
        // Redirect if logged in, but not the owner of this profile.
        if (authenticatedAccount.username !== username) {
          $location.url('/');
          alert('You are not authorized to view this page.');
          return;
        }
      }

      Profile.get(username).then(profileSuccessFn, profileErrorFn);

      /**
      * @name profileSuccessFn
      * @desc Update 'profile' for view
      */
      function profileSuccessFn(data, status, headers, config) {
        vm.profile = data.data;
        // Updating the username will require both the old and new one.
        vm.profile.oldUsername = vm.profile.username;
        // We will change the image url to a base64 one later
        vm.imageDisplay = 'media/' + vm.profile.image;

        bindEvents();

        /**
        * @name bindEvents
        * @desc Offer an image preview
        */
        function bindEvents() {
          // Live preview of the uploaded image
          $scope.$watch(function() { return vm.imageUpload }, function() {
            if (vm.imageUpload)
            {
              var src = 'data:' + vm.imageUpload.filetype + ';base64,' + vm.imageUpload.base64;
              $('#profilePicture').attr('src', src);
            }
          });
        }
      }

      /**
      * @name profileErrorFn
      * @desc Redirect to index
      */
      function profileErrorFn(data, status, headers, config) {
        $location.url('/');
        alert('That user does not exist.');
      }
    }


    /**
    * @name destroy
    * @desc Destroy this user's profile
    * @memberOf thingy.profiles.controllers.SettingsController
    */
    function destroy() {
      Profile.destroy(vm.profile.id).then(destroySuccessFn, destroyErrorFn);

      /**
      * @name profileSuccessFn
      * @desc Unauthenticate and redirect to index
      */
      function destroySuccessFn(data, status, headers, config) {
        Authentication.unauthenticate();
        window.location = '/';

        alert('Your account has been deleted.');
      }

      /**
      * @name profileErrorFn
      * @desc Display error snackbar
      */
      function destroyErrorFn(data, status, headers, config) {
        alert('Could not destroy your account.');
        console.log(data.data.error);
      }
    }


    /**
    * @name update
    * @desc Update this user's profile
    * @memberOf thingy.profiles.controllers.SettingsController
    */
    function update() {
      vm.profile.image = vm.imageUpload.base64;
      Profile.update(vm.profile).then(profileSuccessFn, profileErrorFn);

      /**
      * @name profileSuccessFn
      * @desc Log the user out if the username changed
      */
      function profileSuccessFn(data, status, headers, config) {
        alert('Your profile has been updated. If you changed your username, you will need to log in again');
        // Logout if username changed, could also prompt to relog
        if(vm.profile.oldUsername != vm.profile.username)
          Authentication.logout();
        else
          $route.reload();
      }

      /**
      * @name profileErrorFn
      * @desc Show error in console
      */
      function profileErrorFn(data, status, headers, config) {
        alert('An error occurred');
        console.log(data.data);
      }
    }
  }
})();
