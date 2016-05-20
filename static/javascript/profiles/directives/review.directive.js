(function () {
  'use strict';

  angular
    .module('thingy.profiles.directives')
    .directive('review', review);

  /**
  * @namespace Review
  */
  function review() {
    /**
    * @name directive
    * @desc The directive to be returned
    * @memberOf thingy.profiles.directives.Review
    */
    var directive = {
      restrict: 'E',
      scope: {
        review: '='
      },
      templateUrl: '/static/templates/profiles/review-directive.html'
    };

    return directive;
  }
})();
