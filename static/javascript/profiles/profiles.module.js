(function(){
  'use strict'

  angular
    .module('thingy.profiles', [
      'thingy.profiles.controllers',
      'thingy.profiles.directives',
      'thingy.profiles.services',
    ]);

  angular
    .module('thingy.profiles.controllers', ['naif.base64']);

  angular
    .module('thingy.profiles.directives', []);

  angular
    .module('thingy.profiles.services', []);
})();
