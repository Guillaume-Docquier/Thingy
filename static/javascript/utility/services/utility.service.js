/**
* Utility
* @namespace thingy.utility.services
*/
(function () {
  'use strict';

  angular
    .module('thingy.utility.services')
    .service('Utility', Utility);

  Utility.$inject = ['$window'];

  /**
  * @namespace Utility
  */
  function Utility($window) {
    var vm = this;

    vm.promiseErrorFn = promiseErrorFn;

    // Cannot pass alert as argument...
    function promiseErrorFn(alert, error) {
      $window.alert(alert);
      console.error('Error: ' + JSON.stringify(alert.data));
    }
  }
})();
