(function(){
  'use strict'

  angular
    .module('thingy.authentication', [
      'thingy.authentication.controllers',
      'thingy.authentication.services',
    ]);

  angular
    .module('thingy.authentication.controllers', ['ngDialog']);

  angular
    .module('thingy.authentication.services', ['ngCookies', 'ngRoute']);
})();
