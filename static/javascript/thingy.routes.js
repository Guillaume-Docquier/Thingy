(function () {
  'use strict';

  angular
    .module('thingy.routes')
    .config(config);

  config.$inject = ['$routeProvider'];

  /**
  * @name config
  * @desc Define valid application routes
  */
  function config($routeProvider) {
    $routeProvider
    // Index page
    .when('/', {
      controller: 'IndexController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/home/index.html'
    })
    // Thingy search
    .when('/thingies/search', {
      //controller: 'ThingiesController',
      //controllerAs: 'vm',
      templateUrl: '/static/templates/posts/search.html',
      reloadOnSearch: false
    })
    // Thingy add
    .when('/thingies/add', {
      //controller: 'ThingiesController',
      //controllerAs: 'vm',
      templateUrl: '/static/templates/posts/add.html',
    })
    // User profile
    .when('/users/:username', {
      controller: 'ProfileController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/profiles/profile.html'
    })
    // User settings
    .when('/users/:username/settings', {
      controller: 'ProfileSettingsController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/profiles/settings.html'
    })
    // User Thingies
    .when('/users/:username/thingies', {
      //controller: 'ProfileController',
      //controllerAs: 'vm',
      templateUrl: '/static/templates/profiles/thingies.html'
    })
    // User rents
    .when('/users/:username/rents', {
      //controller: 'ProfileController',
      //controllerAs: 'vm',
      templateUrl: '/static/templates/profiles/rents.html'
    })
    // User reviews
    .when('/users/:username/reviews', {
      //controller: 'ProfileController',
      //controllerAs: 'vm',
      templateUrl: '/static/templates/profiles/reviews.html'
    }).otherwise('/');
  }
})();
