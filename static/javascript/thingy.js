(function () {
  'use strict';

  angular
    .module('thingy', [
      'thingy.config',
      'thingy.routes',
      'thingy.authentication',
      'thingy.home',
      'thingy.profiles',
      'thingy.posts',
      'thingy.utility',
    ]);

  angular
    .module('thingy.routes', ['ngRoute']);

  angular
    .module('thingy.config', []);

  angular
    .module('thingy')
    .run(run);

  run.$inject = ['$http'];

  /**
  * @name run
  * @desc Update xsrf $http headers to align with Django's defaults
  */
  function run($http) {
    $http.defaults.xsrfHeaderName = 'X-CSRFToken';
    $http.defaults.xsrfCookieName = 'csrftoken';
  }
})();
