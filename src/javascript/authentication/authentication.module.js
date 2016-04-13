(function () {
  'use strict';

  angular
    .module('thingy.authentication', [
      'thingy.authentication.controllers',
      'thingy.authentication.services'
    ]);

  angular
    .module('thingy.authentication.controllers', []);

  angular
    .module('thingy.authentication.services', ['ngCookies']);
})();
