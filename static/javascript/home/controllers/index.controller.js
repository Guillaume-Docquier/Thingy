(function(){
  'use strict'

  angular
    .module('thingy.home.controllers')
    .controller('IndexController', IndexController);

  IndexController.$inject = ['$scope'];

  function IndexController($scope) {
    var vm = this;

    // Functions and data
    vm.search = search;

    // Bindings
    // Empty strings to prevent unwanted behaviour due to undefined values
    vm.searchTerm = '';

    function search(advanced){
      window.location = '/thingies/search?advanced=' + advanced + '&search=' + vm.searchTerm;
    }
  }
})();
