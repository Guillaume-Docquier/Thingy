(function () {
  'use strict';

  angular
    .module('thingy.profiles.directives')
    .directive('offer', offer);

  /**
  * @namespace offer
  */
  function offer() {
    /**
    * @name directive
    * @desc The directive to be returned
    * @memberOf thingy.profiles.directives.offer
    */
    var directive = {
      controller: 'OffersController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        offer: '='
      },
      templateUrl: '/static/templates/profiles/offer-directive.html'
    };

    return directive;
  }
})();
