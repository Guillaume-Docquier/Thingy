(function(){
  'use strict'

  angular
    .module('thingy.posts', [
      'thingy.posts.controllers',
      'thingy.posts.services',
      'thingy.posts.directives'
    ]);

  angular
    .module('thingy.posts.controllers', ['ngRoute', 'ngCookies', 'naif.base64', 'ui.calendar']);

  angular
    .module('thingy.posts.services', []);

  angular
    .module('thingy.posts.directives', []);
})();
