/**
* Post
* @namespace thingy.posts.directives
*/
(function () {
  'use strict';

  angular
    .module('thingy.posts.directives')
    .directive('postOverview', postOverview);

  /**
  * @namespace Post
  */
  function postOverview() {
    /**
    * @name directive
    * @desc The directive to be returned
    * @memberOf thingy.posts.directives.postOverview
    */
    var directive = {
      restrict: 'E',
      scope: {
        thingy: '='
      },
      templateUrl: '/static/templates/posts/postoverview-directive.html'
    };

    return directive;
  }
})();
