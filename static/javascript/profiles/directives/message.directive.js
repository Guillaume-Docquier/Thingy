(function () {
  'use strict';

  angular
    .module('thingy.profiles.directives')
    .directive('message', message);

  /**
  * @namespace Message
  */
  function message() {
    /**
    * @name directive
    * @desc The directive to be returned
    * @memberOf thingy.profiles.directives.Message
    */
    var directive = {
      controller: 'MessagesController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        message: '='
      },
      templateUrl: '/static/templates/profiles/message-directive.html'
    };

    return directive;
  }
})();
