(function () {
  'use strict';

  angular
    .module('route', [
      'route.config',
      'route.routes',
      'route.authentication',
      'route.home',
    ]);

  angular
    .module('route.routes', ['ngRoute']);

  angular
    .module('route.config', []);

  angular
    .module('route')
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
