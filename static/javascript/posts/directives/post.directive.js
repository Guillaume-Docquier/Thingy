/**
* Post
* @namespace thingy.posts.directives
*/
(function () {
  'use strict';

  angular
    .module('thingy.posts.directives')
    .directive('post', post);

  /**
  * @namespace Post
  */
  function post() {
    /**
    * @name directive
    * @desc The directive to be returned
    * @memberOf thingy.posts.directives.Post
    */
    var directive = {
      restrict: 'E',
      scope: {
        thingy: '='
      },
      templateUrl: '/static/templates/posts/post-directive.html'
    };

    return directive;
  }
})();
