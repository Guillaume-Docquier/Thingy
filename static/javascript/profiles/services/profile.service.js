/**
* Profile
* @namespace thingy.profiles.services
*/
(function () {
  'use strict';

  angular
    .module('thingy.profiles.services')
    .service('Profile', Profile);

  Profile.$inject = ['$http', 'Authentication'];

  /**
  * @namespace Profile
  */
  function Profile($http, Authentication) {
    var vm = this;

    vm.destroy = destroy
    vm.get = get
    vm.update = update;

    /**
    * @name destroy
    * @desc Destroys the given profile
    * @param {string} id The id of the profile to be destroyed
    * @returns {Promise}
    * @memberOf thingy.profiles.services.Profile
    */
    function destroy(id) {
      return $http.delete('/api/v1/accounts/' + id + '/');
    }


    /**
    * @name get
    * @desc Gets the profile for user with username `username`
    * @param {string} username The username of the user to fetch
    * @returns {Promise}
    * @memberOf thingy.profiles.services.Profile
    */
    function get(username) {
      return $http.get('/api/v1/accounts/' + username + '/');
    }


    /**
    * @name update
    * @desc Update the given profile
    * @param {Object} profile The profile to be updated
    * @returns {Promise}
    * @memberOf thingy.profiles.services.Profile
    */
    function update(profile) {
      return $http.put('/api/v1/accounts/' + profile.oldUsername + '/', profile);
    }
  }
})();
