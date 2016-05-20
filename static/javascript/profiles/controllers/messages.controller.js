(function(){
  'use strict'

  angular
    .module('thingy.profiles.controllers')
    .controller('MessagesController', MessagesController);

  MessagesController.$inject = ['Profile', 'Authentication', '$location'];

  function MessagesController(Profile, Authentication, $location) {
    var vm = this;

    //Data and functions
    vm.send = send;
    vm.validateRecipient = validateRecipient;
    vm.receivedMessages = [];
    vm.sentMessages = [];
    vm.profile = Authentication.getAuthenticatedAccount();
    vm.recipient = '';

    // Bindings
    vm.recipientName = '';
    vm.body = '';

    activate();

    function activate() {
      // Authentication is required
      if(!Authentication.isAuthenticated()) {
        $location.url('/');
        alert('You need to log in first');
        return;
      }
      Profile.getReceivedMessages(vm.profile.id).then(receivedSuccessFn, receivedErrorFn);
      Profile.getSentMessages(vm.profile.id).then(sentSuccessFn, sentErrorFn);

      function receivedSuccessFn(data, status, headers, config) {
        vm.receivedMessages = data.data;
      }

      function receivedErrorFn(data) {
        alert('Could not retrieve your messages');
        console.error('Error: ' + JSON.stringify(data.data));
      }

      function sentSuccessFn(data, status, headers, config) {
        vm.sentMessages = data.data;
      }

      function sentErrorFn(data) {
        alert('Could not retrieve sent messages.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }

    // Send a PM
    function send() {
      Profile.send(vm.recipient.id, vm.body).then(messageSuccessFn, messageErrorFn);

      function messageSuccessFn(data, status, headers, config) {
        alert('Message sent!');
      }

      function messageErrorFn(data) {
        alert('Could not send your message.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }

    // Validates that the recipientName corresponds to a user
    function validateRecipient() {
      Profile.get(vm.recipientName).then(validateSuccessFn, validateErrorFn);

      function validateSuccessFn(data, status, headers, config) {
        // TODO green highlight
        vm.recipient = data.data;
      }

      function validateErrorFn(data) {
        // TODO red highlight
        vm.recipient = '';
      }
    }
  }
})();
