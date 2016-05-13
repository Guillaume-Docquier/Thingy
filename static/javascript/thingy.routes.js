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
    // Login
    .when('/login', {
      controller: 'LoginRegisterController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/login.html',
    })
    // Register
    .when('/register', {
      controller: 'LoginRegisterController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/register.html',
    })
    // Profile
    .when('/profile', {
      controller: 'ProfileController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/profiles/profile.html'
    })
    // Thingy search
    .when('/thingies/search', {
      controller: 'SearchController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/posts/search.html',
      reloadOnSearch: false
    })
    // Thingy detailed
    .when('/thingies/details/:thingyid', {
      controller: 'ThingyController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/posts/thingy.html',
    })
    // Thingy add
    .when('/thingies/add', {
      controller: 'AddController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/posts/add.html',
    })
    // User profile
    .when('/users/:username', {
      controller: 'ProfileController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/profiles/profile.html'
    })
    // User settings
    .when('/settings', {
      controller: 'SettingsController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/profiles/settings.html'
    })
    // User messages
    .when('/users/:username/messages', {
      controller: 'MessagesController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/profiles/messages.html'
    })
    // TODO User Thingies
    .when('/users/:username/thingies', {
      controller: 'ProfileController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/profiles/thingies.html'
    })
    // TODO User rents
    .when('/users/:username/rents', {
      controller: 'ProfileController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/profiles/rents.html'
    })
    // TODO User reviews
    .when('/users/:username/reviews', {
      controller: 'ProfileController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/profiles/reviews.html'
    }).otherwise('/');
  }
})();
