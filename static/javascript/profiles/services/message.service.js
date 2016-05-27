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
    vm.markAsRead = markAsRead;
    vm.getSystemMessages = getSystemMessages;
    vm.getPrivateMessages = getPrivateMessages;
    vm.getSentMessages = getSentMessages;
    vm.getUnreadNumber = getUnreadNumber;


    /**
    * @name sendMessage
    * @desc Send a private message
    * @param {}
    * @returns {Promise}
    * @memberOf thingy.messages.services.Message
    */
    function sendMessage(body, recipientId) {
      return $http.post('api/v1/privatemessages/', {
        body: body,
        recipient: recipientId
      });
    }


    /**
    * @name markAsRead
    * @desc Mark the message as read
    * @param {Object} message The message to mark as read
    * @returns {Promise}
    * @memberOf thingy.messages.services.Message
    */
    function markAsRead(message) {
      var apiEndpoint;
      if (message.type)
        apiEndpoint = 'rentmessages';
      else
        apiEndpoint = 'privatemessages';

      return $http.put('api/v1/' + apiEndpoint + '/' + message.id + '/', message);
    }

    /**
    * @name getSystemMessages
    * @desc Get all received system messages of a user
    * @param {string} id The id of the user
    * @returns {Promise}
    * @memberOf thingy.messages.services.Message
    */
    function getSystemMessages() {
      return $http.get('api/v1/rentmessages/?thingy__author=' + Authentication.getAuthenticatedAccount().id);
    }

    /**
    * @name getPrivateMessages
    * @desc Get all received private messages of a user
    * @param {string} id The id of the user
    * @returns {Promise}
    * @memberOf thingy.messages.services.Message
    */
    function getPrivateMessages() {
      return $http.get('api/v1/privatemessages/?recipient=' + Authentication.getAuthenticatedAccount().id);
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

    /**
    * @name getUnreadNumber
    * @desc Get the number of unread messages
    * @returns {Promise}
    * @memberOf thingy.messages.services.Message
    */
    function getUnreadNumber() {
      return $http.get('api/v1/accounts/' + Authentication.getAuthenticatedAccount().id + '/unread/');
    }
  }
})();
