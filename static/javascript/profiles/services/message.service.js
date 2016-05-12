/**
* Message
* @namespace thingy.messages.services
*/
(function () {
  'use strict';

  angular
    .module('thingy.profiles.services')
    .service('Message', Message);

  Message.$inject = ['$http', 'Authentication'];

  /**
  * @namespace Message
  */
  function Message($http, Authentication) {
    var vm = this;

    vm.sendMessage = sendMessage;
    vm.getReceivedMessages = getReceivedMessages;
    vm.getSentMessages = getSentMessages;


    /**
    * @name getReceivedMessages
    * @desc Get all received messages of a user
    * @param {string} id The id of the user
    * @returns {Promise}
    * @memberOf thingy.messages.services.Message
    */
    function sendMessage(message) {
      return $http.post('api/v1/messages/', {
        type: '',
        body: '',
        recipient: ''
      });
    }

    /**
    * @name getReceivedMessages
    * @desc Get all received messages of a user
    * @param {string} id The id of the user
    * @returns {Promise}
    * @memberOf thingy.messages.services.Message
    */
    function getReceivedMessages(id) {
      return $http.get('api/v1/recipient/' + id + '/');
    }

    /**
    * @name getSentMessages
    * @desc Get all sent messages of the user
    * @param {string} id The id of the user
    * @returns {Promise}
    * @memberOf thingy.messages.services.Message
    */
    function getSentMessages(id) {
      return $http.get('api/v1/messages/' + id + '/sent/');
    }
  }
})();
