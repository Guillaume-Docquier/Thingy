(function(){
  'use strict'

  angular
    .module('thingy.home.controllers')
    .controller('IndexController', IndexController);

  IndexController.$inject = ['$scope', 'Posts'];

  function IndexController($scope, Posts) {
    var vm = this;

    // Functions and data
    vm.search = search;
    vm.regions = [];

    // Bindings
    // Empty strings to prevent unwanted behaviour due to undefined values
    vm.searchTerm = '';
    vm.region = '';

    activate();

    function activate() {
      Posts.getAllRegions().then(regionsSuccessFn, regionsErrorFn);

      function regionsSuccessFn(data) {
        vm.regions = data.data;
      }

      function regionsErrorFn(data) {
        alert('Could not load regions.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }

    function search(advanced){
      window.location = '/thingies/search?advanced=' + advanced + '&search=' + vm.searchTerm + '&region=' + vm.region.name;
    }
  }
})();
