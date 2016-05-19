/**
* ProfileController
* @namespace thingy.profiles.controllers
*/
(function(){
  'use strict'

  angular
    .module('thingy.profiles.controllers')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$location', 'Profile', 'Posts', 'Message', 'Authentication'];

  /**
  * @namespace ProfileController
  */
  function ProfileController($location, Profile, Posts, Message, Authentication) {
    var vm = this;

    // Functions and data
    vm.sendMessage = sendMessage;
    vm.validateRecipient = validateRecipient;
    vm.getUnreadMessages = getUnreadMessages;
    vm.unreadNum = 0;
    vm.isOwner = true;
    vm.isAuthenticated = Authentication.isAuthenticated();
    vm.profile = '';
    vm.receivedMessages = [];
    vm.sentMessages = [];
    vm.posts = [];
    vm.reviews = [];

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

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf thingy.profiles.controllers.ProfileController
    */
    function activate() {
      if(!vm.isAuthenticated) {
        $location.url('/');
        return;
      }
      else vm.profile = Authentication.getAuthenticatedAccount();

      //Message.getReceivedMessages(vm.profile.id).then(getRSuccessFn, getRErrorFn);
      //Message.getSentMessages(vm.profile.id).then(getSSucessFn, getSErrorFn);
      Posts.getUserPosts(vm.profile.username).then(postsSuccessFn, postsErrorFn);
      Profile.getReviews(vm.profile.id).then(reviewsSuccessFn, reviewsErrorFn);

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

      /**
        * @name reviewsSuccessFn
        * @desc Update 'reviews' on viewmodel
        */
      function reviewsSuccessFn(data) {
        vm.reviews = data.data;
        for(var i = 0; i < vm.reviews.length; i++) {
          vm.reviews[i].created = moment(vm.reviews[i].created).format('MMMM Do HH:mm');
        }
      }

      /**
        * @name reviewsErrorFn
        * @desc Log error in the console
        */
      function reviewsErrorFn(data) {
        alert('Could not load reviews.');
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

    /**
    * @name createReview
    * @desc Create a review
    */
    function createReview() {
      Profile.createReview(
        vm.profile.id,
        vm.description,
        vm.rating
      ).then(reviewSuccessFn, reviewErrorFn);

      /**
      * @name reviewSuccessFn
      * @desc Notifiy of success
      */
      function reviewSuccessFn(data) {
        alert('Review created!');
      }

      /**
      * @name reviewErrorFn
      * @desc Notify of error and log it in the console
      */
      function reviewErrorFn() {
        alert('Could not create the review.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }
  }
})();
