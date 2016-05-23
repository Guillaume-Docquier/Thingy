/**
* Profile
* @namespace thingy.profiles.services
*/
(function () {
  'use strict';

  angular
    .module('thingy.profiles.services')
    .service('Profile', Profile);

  Profile.$inject = ['$http', 'Authentication', '$window'];

  /**
  * @namespace Profile
  */
  function Profile($http, Authentication, $window) {
    var vm = this;

    vm.destroy = destroy
    vm.get = get
    vm.update = update;
    vm.usernameAvailable = usernameAvailable;
    vm.getReviews = getReviews;
    vm.createReview = createReview;

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

    function usernameAvailable(username) {
      return $http.get('api/v1/accounts/?username=' + username);
    }

    function getReviews(profileId) {
      return $http.get('api/v1/reviews/?reviewed_user=' + profileId);
    }

    /**
    * @name createReview
    * @desc Create a review for a given user
    * @param {number} reviewedUserId The id of the reviewed user
    * @param {string} comment A comment about the user experience
    * @param {number} rating A rating from 1 to 5
    * @returns {Promise}
    * @memberOf thingy.profile.services.Profile
    */
    function createReview(reviewedUserId, comment, rating) {
      return $http.post('api/v1/reviews/', {
        reviewed_user: reviewedUserId,
        comment: comment,
        rating: rating
      });
    }
  }
})();
