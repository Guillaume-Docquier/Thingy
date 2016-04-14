/**
* NavbarController
* @namespace thingy.layout.controllers
*/
(function () {
  'use strict';

  angular
    .module('thingy.home.controllers')
    .controller('NavbarController', NavbarController);

  NavbarController.$inject = ['$rootScope', '$scope', 'Authentication'];

  /**
  * @namespace NavbarController
  */
  function NavbarController($rootScope, $scope, Authentication) {
    var vm = this;

    vm.logout = logout;
    vm.isAuthenticated = Authentication.isAuthenticated();

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf thingy.home.controllers.NavbarController
    */
    function activate() {
      console.log('Activate: ' + vm.isAuthenticated);
      $scope.$on('user.authentication', function(){
        vm.isAuthenticated = Authentication.isAuthenticated();
        console.log('Auth: ' + vm.isAuthenticated);
      });
    }

    /**
    * @name logout
    * @desc Log the user out
    * @memberOf thingy.layout.controllers.NavbarController
    */
    function logout() {
      Authentication.logout();
    }
  }
})();
