(function () {
  'use strict';

  angular
    .module('thingy.profiles.directives')
    .directive('message', message);

  /**
  * @namespace Post
  */
  function message() {
    /**
    * @name directive
    * @desc The directive to be returned
    * @memberOf thingy.profiles.directives.Message
    */
    var directive = {
      restrict: 'E',
      scope: {
        message: '='
      },
      templateUrl: '/static/templates/posts/message-directive.html'
    };

    return directive;
  }
})();
