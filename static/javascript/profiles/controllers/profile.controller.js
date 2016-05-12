(function(){
  'use strict'

  angular
    .module('thingy.profiles.controllers')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$scope', '$location', '$routeParams', 'Profile', 'Posts', 'Message'];

  /**
  * @namespace ProfileController
  */
  function ProfileController($scope, $location, $routeParams, Profile, Posts, Message) {
    var vm = this;

    // Functions and data
    vm.sendMessage = sendMessage;
    vm.validateRecipient = validateRecipient;
    vm.getUnreadMessages = getUnreadMessages;
    vm.unreadNum = 0;
    vm.profile = '';
    vm.receivedMessages = [];
    vm.sentMessages = [];
    vm.posts = [];

    // Bindings
    vm.newMessage = {
      body: '',
      recipient: {
        username: '',
        id: '',
        valid: false
      },
      type: 4
    };

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf thingy.profiles.controllers.ProfileController
    */
    function activate() {
      var username = $routeParams.username;

      // Prevents a bug where Profile.get("something.something") returns index.html's code...
      if (username.match(/\./)) {
        window.location = '/';
        return;
      }

      Profile.get(username).then(profileSuccessFn, profileErrorFn);

      /**
      * @name profileSuccessProfile
      * @desc Update 'profile' on viewmodel
      */
      function profileSuccessFn(data, status, headers, config) {
        vm.profile = data.data;
        Message.getReceivedMessages(vm.profile.id).then(getRSuccessFn, getRErrorFn);
        //Message.getSentMessages(vm.profile.id).then(getSSucessFn, getSErrorFn);
        Posts.getUserPosts(vm.profile.username).then(postsSuccessFn, postsErrorFn);
      }

      /**
      * @name profileErrorFn
      * @desc Redirect to index and log error in the console
      */
      function profileErrorFn(data) {
        $location.url('/');
        alert('Could not load profile.');
        console.error('Error: ' + JSON.stringify(data.data));
      }

      /**
      * @name getRSuccessFn
      * @desc Update 'receivedMessages' on viewmodel
      */
      function getRSuccessFn(data, status, headers, config) {
        vm.receivedMessages = data.data.messages;
        vm.getUnreadMessages();
      }

      /**
      * @name getRErrorFn
      * @desc Log error in the console
      */
      function getRErrorFn(data) {
        alert('Could not load received messages.');
        console.error('Error: ' + JSON.stringify(data.data));
      }

      /**
        * @name postsSucessFn
        * @desc Update 'posts' on viewmodel
        */
      function postsSuccessFn(data, status, headers, config) {
        vm.posts = data.data;
      }

      /**
        * @name postsErrorFn
        * @desc Log error in the console
        */
      function postsErrorFn(data) {
        alert('Could not load posts.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }

    function sendMessage() {
      Message.sendMessage(
        vm.newMessage.type,
        vm.newMessage.body,
        vm.newMessage.recipient.id
      ).then(sendSuccessFn, sendErrorFn);

      function sendSuccessFn() {
        alert('Message sent!');
      }

      function sendErrorFn(data) {
        alert('Could not send your message.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }

    function validateRecipient() {
      console.log('Validating.');
      Profile.get(vm.newMessage.recipient.username).then(validateSuccessFn, validateErrorFn);

      function validateSuccessFn(data) {
        // TODO green highlight
        vm.newMessage.recipient.id = data.data.id;
        vm.newMessage.recipient.valid = 1;
      }

      function validateErrorFn(data) {
        // TODO red highlight
        vm.newMessage.recipient.valid = 0;
      }
    }

    function getUnreadMessages() {
      vm.unreadNum = 0;
      for(var i = 0; i < vm.receivedMessages.length; i++) {
        if(vm.receivedMessages[i].unread)
          vm.unreadNum++;
      }
    }
  }
})();
