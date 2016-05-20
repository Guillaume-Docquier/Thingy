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
    vm.availability = '';

    // Bindings, empty string to prevent unwanted behaviour
    vm.period = {};
    vm.message = '';

    activate()

    function activate() {
      var thingyId = $routeParams.postid;

      Posts.getSinglePost(thingyId).then(postSuccessFn, postErrorFn);
      vm.profile = Authentication.getAuthenticatedAccount();
      // Calendar
      vm.uiConfig = {
        calendar: {
          height: 450,
          editable: true,
          header: {
            left: '',
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
      vm.period = {
        start: moment().format('YYYY-MM-DD'),
        end: moment().add(1, 'days').format('YYYY-MM-DD')//.format('ddd, MMMM Do')
      }


      function postSuccessFn(data, status, headers, config) {
        var classes = ['', 'btn-success', 'btn-warning', 'btn-danger']
        vm.post = data.data;
        vm.availability = classes[vm.post.status_details.id];
      }

      function postErrorFn(data) {
        alert('Could not retrieve post.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }

    // Request to rent a Thingy
    function rent() {
      // Requires authentication
      if(Authentication.isAuthenticated)
        Posts.rent(vm.post.id, vm.period, vm.message).then(rentSuccessFn, rentErrorFn);
      else
        alert('You need to be logged in.');

      function rentSuccessFn(data) {
        alert('Your request has been submitted!');
      }

      function rentErrorFn(data) {
        alert('Could not send rent request.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }
  }
})();
