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
      console.log('Loading messages');
      Profile.getReceivedMessages(vm.profile.id).then(receivedSuccessFn, receivedErrorFn);
      Profile.getSentMessages(vm.profile.id).then(sentSuccessFn, sentErrorFn);

      function receivedSuccessFn(data, status, headers, config) {
        vm.receivedMessages = data.data;
      }

      function receivedErrorFn(data, status, headers, config) {
        alert('Could not retrieve your messages');
        console.log(data.data.error);
      }

      function sentSuccessFn(data, status, headers, config) {
        vm.sentMessages = data.data;
      }

      function sentErrorFn(data, status, headers, config) {
        alert('Could not retrieve sent messages.');
        console.log(data.data.error);
      }
    }

    // Send a PM
    function send() {
      Profile.send(vm.recipient.id, vm.body).then(messageSuccessFn, messageErrorFn);

      function messageSuccessFn(data, status, headers, config) {
        alert('Message sent!');
        console.log(data.data);
      }

      function messageErrorFn(data, status, headers, config) {
        alert('Could not send your message.');
        console.log(data.data.error);
      }
    }

    // Validates that the recipientName corresponds to a user
    function validateRecipient() {
      Profile.get(vm.recipientName).then(validateSuccessFn, validateErrorFn);

      function validateSuccessFn(data, status, headers, config) {
        // TODO green highlight
        vm.recipient = data.data;
      }

      function validateErrorFn(data, status, headers, config) {
        // TODO red highlight
        vm.recipient = '';
      }
    }
  }
})();
