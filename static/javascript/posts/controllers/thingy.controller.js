/**
* ThingyController
* @namespace thingy.posts.controllers
*/
(function(){
  'use strict'

  angular
    .module('thingy.posts.controllers')
    .config(function(uiGmapGoogleMapApiProvider) {
      uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyDnKFezpw2JUfe2wh43THS3tTFeK72_WMA',
        libraries: 'weather,geometry,visualization'
      });
    });

  angular
    .module('thingy.posts.controllers')
    .controller('ThingyController', ThingyController);

  ThingyController.$inject = ['Posts', '$routeParams', 'Authentication', '$scope', 'uiGmapGoogleMapApi'];

  /**
  * @namespace ThingyController
  */
  function ThingyController(Posts, $routeParams, Authentication, $scope, uiGmapGoogleMapApi) {
    var vm = this;

    // Functions and Data
    vm.rent = rent;
    vm.profile = '';
    vm.post = '';
    vm.uiConfig = '';
    vm.eventSources = {};
    vm.availability = '';
    vm.map = '';

    // Bindings, empty string to prevent unwanted behaviour
    vm.period = {};
    vm.message = '';

    activate()

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf thingy.posts.controllers.ThingyController
    */
    function activate() {
      var thingyId = $routeParams.postid;

      Posts.getSinglePost(thingyId).then(postSuccessFn, postErrorFn);
      uiGmapGoogleMapApi.then(gMapsLoaded);
      vm.map = { center: { latitude: 59.8586, longitude: 17.6389 }, zoom: 11 };
      vm.profile = Authentication.getAuthenticatedAccount();
      // Calendar, not used right now
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
      // Test event sources
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


      /**
      * @name postSuccessFn
      * @desc Update 'post' in viewmodel
      */
      function postSuccessFn(data) {
        var classes = ['', 'btn-success', 'btn-warning', 'btn-danger']
        vm.post = data.data;
        vm.availability = classes[vm.post.status_details.id];
      }

      /**
      * @name postErrorFn
      * @desc Notify of error and log to console
      */
      function postErrorFn(data) {
        alert('Could not retrieve post.');
        console.error('Error: ' + JSON.stringify(data.data));
      }

      /**
      * @name gMapsLoaded
      * @desc Callback for google maps
      * @param {Object} maps The google maps object
      */
      function gMapsLoaded(maps) {
        // Can do stuff here
      }
    }

    /**
    * @name rent
    * @desc Produce a rent request
    */
    function rent() {
      // Requires authentication
      if(Authentication.isAuthenticated)
        Posts.rent('request', {
          postId: vm.post.id,
          period: vm.period,
          message:  vm.message
        }).then(rentSuccessFn, rentErrorFn);
      else
        alert('You need to be logged in.');

      /**
      * @name rentSuccessFn
      * @desc Notify of success
      */
      function rentSuccessFn(data) {
        alert('Your request has been submitted!');
      }

      /**
      * @name rentErrorFn
      * @desc Notify of error and log to console
      */
      function rentErrorFn(data) {
        alert('Could not send rent request.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }
  }
})();
