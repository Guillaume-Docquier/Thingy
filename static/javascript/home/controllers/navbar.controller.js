/**
* NavbarController
* @namespace thingy.layout.controllers
*/
(function () {
  'use strict';

  angular
    .module('thingy.home.controllers')
    .controller('NavbarController', NavbarController);

  NavbarController.$inject = ['$rootScope', '$scope', 'Authentication', 'Message'];

  /**
  * @namespace NavbarController
  */
  function NavbarController($rootScope, $scope, Authentication, Message) {
    var vm = this;

    vm.logout = logout;
    vm.updateNotificationStatus = updateNotificationStatus;
    vm.isAuthenticated = Authentication.isAuthenticated();

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf thingy.home.controllers.NavbarController
    */
    function activate() {
      $scope.$on('user.authentication', function(){
        vm.isAuthenticated = Authentication.isAuthenticated();
      });
      // Route change end
      $rootScope.$on("$routeChangeStart", function(current, previous) {
        Message.getSystemMessages().then(messagesSuccessFn, messagesErrorFn);
        Message.getPrivateMessages().then(messagesSuccessFn, messagesErrorFn);

        function messagesSuccessFn(data) {
          var notification = 0;
          for(var i = 0; i < data.data.length; i++) {
            // Check unread message
            if(data.data[i].unread) {
              notification = 1;
              break;
            }
          }
          vm.updateNotificationStatus(notification)
        }

        function messagesErrorFn(data) {
          console.log('Something went wrong');
        }
      });
    }

    /**
    * @name logout
    * @desc Log the user out
    * @memberOf thingy.home.controllers.NavbarController
    */
    function logout() {
      Authentication.logout();
    }

    /**
    * @name updateNotificationStatus
    * @desc Update the userIcon if there's a new notification
    * @memberOf thingy.home.controllers.NavbarController
    */
    function updateNotificationStatus(notification) {
      if(notification) {
        $('#userIcon').removeClass('glyphicon-user');
        $('#userIcon').addClass('glyphicon-exclamation-sign');
      }
      else {
        $('#userIcon').removeClass('glyphicon-exclamation-sign');
        $('#userIcon').addClass('glyphicon-user');
      }
    }
  }
})();
