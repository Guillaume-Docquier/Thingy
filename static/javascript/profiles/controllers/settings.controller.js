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
    '$location', '$scope', '$routeParams', 'Authentication', 'Profile',
  ];

  /**
  * @namespace SettingsController
  */
  function SettingsController($location, $scope, $routeParams, Authentication, Profile) {
    var vm = this;

    // Functions and Data
    vm.destroy = destroy;
    vm.update = update;
    vm.imageUpload;

    // Bindings
    vm.profile;

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
      * @desc Update `profile` for view
      */
      function profileSuccessFn(data, status, headers, config) {
        vm.profile = data.data;
        // Updating the username will require both the old and new one.
        vm.profile.oldUsername = vm.profile.username;

        bindEvents();


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
      Profile.destroy(vm.profile.username).then(profileSuccessFn, profileErrorFn);

      /**
      * @name profileSuccessFn
      * @desc Redirect to index and display success snackbar
      */
      function profileSuccessFn(data, status, headers, config) {
        Authentication.unauthenticate();
        window.location = '/';

        alert('Your account has been deleted.');
      }


      /**
      * @name profileErrorFn
      * @desc Display error snackbar
      */
      function profileErrorFn(data, status, headers, config) {
        alert(data.error);
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
      * @desc Show success snackbar
      */
      function profileSuccessFn(data, status, headers, config) {
        alert('Your profile has been updated.');
        // Authenticate and reload the page to reflect the change of username
        if(vm.profile.username != vm.profile.oldUsername)
        {
          Authentication.setAuthenticatedAccount(vm.profile);
          window.location = "/users/" + vm.profile.username + "/settings";
        }
      }

      /**
      * @name profileErrorFn
      * @desc Show error snackbar
      */
      function profileErrorFn(data, status, headers, config) {
        alert('An error occurred');
        console.log(data.data);
      }
    }
  }
})();
