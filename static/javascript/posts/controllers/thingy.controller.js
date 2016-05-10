(function(){
  'use strict'

  angular
    .module('thingy.posts.controllers')
    .controller('ThingyController', ThingyController);

  ThingyController.$inject = ['Posts', '$routeParams', 'Authentication', '$scope'];

  function ThingyController(Posts, $routeParams, Authentication, $scope) {
    var vm = this;

    // Functions and Data
    vm.rent = rent;
    vm.profile = '';
    vm.post = '';
    vm.uiConfig = '';
    vm.eventSources = {};

    // Bindings, empty string to prevent unwanted behaviour
    vm.dates = [];

    activate()

    function activate() {
      var thingyId = $routeParams.thingyid;

      Posts.getSinglePost(thingyId).then(postSuccessFn, postErrorFn);
      vm.profile = Authentication.getAuthenticatedAccount();
      // Calendar
      vm.uiConfig = {
        calendar: {
          height: 450,
          editable: true,
          header: {
            left: 'month basicWeek',
            center: 'title',
            right: 'today prev,next'
          },
          dayClick: $scope.alertEventOnClick,
          eventDrop: $scope.alertOnDrop,
          eventResize: $scope.alertOnResize
        }
      };
      vm.eventSources = {
        events: [
          {
            title: 'Unavailable',
            start: '2016-05-12',
            end: '2016-05-17',
            rendering: 'background',
          },
          {
            title: 'Unavailable',
            start: '2016-05-29',
            end: '2016-06-01',
            rendering: 'background',
          },
          {
            title: 'Unavailable',
            start: '2016-06-09',
            end: '2016-06-24',
            rendering: 'background',
          },
        ],
        color: 'red',
        allDayDefault: 'true'
      };

      function postSuccessFn(data, status, headers, config) {
        vm.post = data.data;
      }

      function postErrorFn() {
        alert('Error in retrieving post');
        console.log(data.data.error);
      }
    }

    // Request to rent a Thingy
    function rent() {
      // Requires authentication
      if(Authentication.isAuthenticated)
        Posts.rent(vm.profile.id, vm.post.id, 'request', vm.dates).then(rentSuccessFn, rentErrorFn);
      else
        alert('You need to be logged in.');

      function rentSuccessFn(data, status, headers, config) {
        alert('Your request has been submitted!');
        console.log(data.data);
      }

      function rentErrorFn(data, status, headers, config) {
        alert('We could not send your request.');
        console.log(data.data.error);
      }
    }
  }
})();
