(function(){
  'use strict'

  angular
    .module('thingy.posts.controllers')
    .controller('ThingyController', ThingyController);

  ThingyController.$inject = ['Posts', '$routeParams', 'Authentication'];

  function ThingyController(Posts, $routeParams, Authentication) {
    var vm = this;

    // Functions and Data
    vm.rent = rent;
    vm.post = '';

    // Bindings, empty string to prevent unwanted behaviour


    activate()

    function activate() {
      var thingyId = $routeParams.thingyid;

      Posts.getSinglePost(thingyId).then(postSuccessFn, postErrorFn);

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
        Posts.rent(vm.post.id, 'request').then(rentSuccessFn, rentErrorFn);
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
