/**
* ProfileController
* @namespace thingy.profiles.controllers
*/
(function(){
  'use strict'

  angular
    .module('thingy.profiles.controllers')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$scope', '$location', '$routeParams', 'Profile', 'Posts', 'Message', 'Authentication'];

  /**
  * @namespace ProfileController
  */
  function ProfileController($scope, $location, $routeParams, Profile, Posts, Message, Authentication) {
    var vm = this;

    // Functions and data
    vm.sendMessage = sendMessage;
    vm.validateRecipient = validateRecipient;
    vm.getUnreadMessages = getUnreadMessages;
    vm.unreadNum = 0;
    vm.isOwner = false;
    vm.isAuthenticated = Authentication.isAuthenticated();
    vm.profile = '';
    vm.receivedMessages = [];
    vm.sentMessages = [];
    vm.posts = [];
    vm.ratings = [1,2,3,4,5]

    // Bindings
    vm.newMessage = {
      body: '',
      recipient: {
        username: '',
        id: '',
        valid: false
      },
      type: 4 // Private message
    };
    vm.description = '';
    vm.rating = 0;

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf thingy.profiles.controllers.ProfileController
    */
    function activate() {
      // Needed for public profiles
      var username = $routeParams.username;

      // When visiting a public profile
      if(username) {
        // There's a bug if username contains a dot.
        if (username.match(/\./)) {
          $location.url('/');
          return;
        }
      }
      // When visiting a private profile
      else if(!vm.isAuthenticated) {
        $location.url('/');
        return;
      }
      else username = Authentication.getAuthenticatedAccount().username;

      Profile.get(username).then(profileSuccessFn, profileErrorFn);

      /**
      * @name profileSuccessProfile
      * @desc Update 'profile' on viewmodel
      */
      function profileSuccessFn(data, status, headers, config) {
        vm.profile = data.data;
        // Fetch more info if own profile
        vm.isOwner = vm.isAuthenticated && vm.profile.username == Authentication.getAuthenticatedAccount().username;
        if(vm.isOwner)
        {
          Message.getReceivedMessages(vm.profile.id).then(getRSuccessFn, getRErrorFn);
        //Message.getSentMessages(vm.profile.id).then(getSSucessFn, getSErrorFn);
        }
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

    /**
    * @name sendMessage
    * @desc Send a private message to another user
    */
    function sendMessage() {
      Message.sendMessage(
        vm.newMessage.type,
        vm.newMessage.body,
        vm.newMessage.recipient.id
      ).then(sendSuccessFn, sendErrorFn);

      /**
      * @name sendSuccessFn
      * @desc Display success message
      */
      function sendSuccessFn() {
        alert('Message sent!');
      }

      /**
      * @name sendErrorFn
      * @desc Display an error message and log the details in the console
      */
      function sendErrorFn(data) {
        alert('Could not send your message.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }

    /**
    * @name validateRecipient
    * @desc Send a request to the db to verify if this username exists
    */
    function validateRecipient() {
      Profile.get(vm.newMessage.recipient.username).then(validateSuccessFn, validateErrorFn);

      /**
      * @name validateSuccessFn
      * @desc Update 'newMessage' in the viewmodel
      */
      function validateSuccessFn(data) {
        vm.newMessage.recipient.id = data.data.id;
        vm.newMessage.recipient.valid = 1;
      }

      /**
      * @name validateErrorFn
      * @desc Update 'newMessage' in the viewmodel to reflect a failure
      */
      function validateErrorFn(data) {
        vm.newMessage.recipient.valid = 0;
      }
    }

    /**
    * @name getUnreadMessages
    * @desc Get the number of unread messages
    */
    function getUnreadMessages() {
      vm.unreadNum = 0;
      for(var i = 0; i < vm.receivedMessages.length; i++) {
        if(vm.receivedMessages[i].unread)
          vm.unreadNum++;
      }
    }
  }
})();
