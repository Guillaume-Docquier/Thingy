(function () {
  'use strict';

  angular
    .module('thingy.posts', [
      'thingy.posts.controllers',
      'thingy.posts.directives',
      'thingy.posts.services'
    ]);

  angular
    .module('thingy.posts.controllers', []);

  angular
    .module('thingy.posts.directives', ['ngDialog']);

  angular
    .module('thingy.posts.services', []);
})();
