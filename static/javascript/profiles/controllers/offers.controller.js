(function(){
  'use strict'

  angular
    .module('thingy.profiles.controllers')
    .controller('OffersController', OffersController);

  OffersController.$inject = ['Authentication', 'Posts', '$scope', '$rootScope'];

  function OffersController(Authentication, Posts, $scope, $rootScope) {
    var vm = this;

    // Functions and Data
    vm.rent = rent;
    vm.offer = $scope.offer;

    function rent(status, id) {
      Posts.rent(status, {request: vm.offer}).then(rentSuccessFn, rentErrorFn);

      function rentSuccessFn(data) {
        if (status == 'accept')
        {
          alert('You successfully rented your Thingy!');
          vm.offer.status = 'Accepted';
        }
        else
        {
          alert('The offer was declined.');
          vm.offer.status = 'Declined';
        }

        //Broadcast the event so that profile.controller can move the offer from pending to processed
        $rootScope.$broadcast('offer.processed', vm.offer);
      }

      function rentErrorFn(data) {
        alert('Could not transmit answer.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }
  }
})();
