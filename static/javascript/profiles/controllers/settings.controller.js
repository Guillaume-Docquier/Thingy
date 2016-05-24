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
    vm.authenticated = Authentication.isAuthenticated();

    // Bindings
    vm.profile = '';
    vm.imageUpload = '';

    activate();


    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated.
    * @memberOf thingy.profiles.controllers.SettingsController
    */
    function activate() {

      // Redirect if not logged in
      if (!vm.authenticated) {
        $location.url('/login?redirect=settings');
        return;
      }

      if (vm.authenticated)
        Profile.get(Authentication.getAuthenticatedAccount().username).then(profileSuccessFn, profileErrorFn);

      /**
      * @name profileSuccessFn
      * @desc Update 'profile' for view
      */
      function profileSuccessFn(data, status, headers, config) {
        vm.profile = data.data;
        // Renew authentication
        Authentication.setAuthenticatedAccount(vm.profile);
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
      function profileErrorFn(data) {
        $location.url('/');
        alert('That user does not exist.');
        console.error('Error: ' + JSON.stringify(data.data));
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
      function destroyErrorFn(data) {
        alert('Could not destroy your account.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }


    /**
    * @name update
    * @desc Update this user's profile
    * @memberOf thingy.profiles.controllers.SettingsController
    */
    function update() {
      vm.profile.image = vm.imageUpload.base64;
      Profile.update(vm.profile).then(updateSuccessFn, updateErrorFn);

      /**
      * @name profileSuccessFn
      * @desc Log the user out if the username changed
      */
      function updateSuccessFn(data, status, headers, config) {
        alert('Your profile has been updated. If you changed your username, you will need to log in again');
        // Logout if username changed, user will then be prompted to relog
        if(vm.profile.oldUsername != vm.profile.username)
          Authentication.logout();

        else $route.reload();
      }

      /**
      * @name profileErrorFn
      * @desc Show error in console
      */
      function updateErrorFn(data) {
        alert('Could not update profile.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }
  }
})();
