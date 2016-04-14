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
    $routeProvider.when('/', {
      controller: 'IndexController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/home/index.html'
    }).when('/register', {
      controller: 'RegisterController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/register.html'
    }).when('/login', {
      controller: 'LoginController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/login.html'
    }).when('/test', {
      controller: 'LoginController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/login.html'
    }).when('/me', {
      controller: 'ProfileController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/profiles/profile-index.html'
    }).when('/thingies', {
      controller: 'ThingiesController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/posts/thingies-index.html'
    }).otherwise('/');
  }
})();
