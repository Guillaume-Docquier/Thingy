(function(){
  'use strict'

  angular
    .module('route.authentication', [
      'route.authentication.controllers',
      'route.authentication.services',
    ]);

  angular
    .module('route.authentication.controllers', ['ngDialog']);

  angular
    .module('route.authentication.services', ['ngCookies']);
})();
