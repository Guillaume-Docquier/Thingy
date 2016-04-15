/**
* Post
* @namespace thinkster.posts.directives
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
    * @memberOf thinkster.posts.directives.Post
    */
    var directive = {
      controller: 'ThingiesController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        thingy: '='
      },
      templateUrl: '/static/templates/posts/post.html'
    };

    return directive;
  }
})();
