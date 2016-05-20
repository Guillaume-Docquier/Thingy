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
    vm.markAsRead = markAsRead;
    vm.unreadNumber = 0;
    vm.isOwner = true;
    vm.isAuthenticated = Authentication.isAuthenticated();
    vm.profile = '';
    vm.receivedMessages = [];
    vm.sentMessages = [];
    vm.posts = [];
    vm.reviews = [];
    vm.averageRating = 0;

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

      Message.getReceivedMessages().then(getRSuccessFn, getRErrorFn);
      //Message.getSentMessages(vm.profile.id).then(getSSucessFn, getSErrorFn);
      Posts.getUserPosts(vm.profile.username).then(postsSuccessFn, postsErrorFn);
      Profile.getReviews(vm.profile.id).then(reviewsSuccessFn, reviewsErrorFn);

      /**
      * @name getRSuccessFn
      * @desc Update 'receivedMessages' on viewmodel
      */
      function getRSuccessFn(data) {
        vm.receivedMessages = data.data.reverse();
        // Format the date and change the type
        for (var i = 0; i < vm.receivedMessages.length; i++)
          vm.receivedMessages[i].created_at = moment(vm.receivedMessages[i].created_at).format('MMMM Do HH:mm');
        Message.getUnreadNumber().then(unreadSuccessFn, unreadErrorFn);

        /**
        * @name unreadSuccessFn
        * @desc Update 'unreadNumber' on viewmodel
        */
        function unreadSuccessFn(data) {
          vm.unreadNumber = data.data[0] ? data.data[0].count : 0;
        }

        /**
        * @name unreadErrorFn
        * @desc Log error in the console
        */
        function unreadErrorFn(data) {
          alert('Could not fetch the number of unread messages.');
          console.error('Error: ' + JSON.stringify(data.data));
        }
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
        var totalRating = 0;
        for(var i = 0; i < vm.reviews.length; i++) {
          vm.reviews[i].created = moment(vm.reviews[i].created).format('MMMM Do HH:mm');
          totalRating += vm.reviews[i].rating_details.rating_grade;
        }
        vm.averageRating = Math.round( totalRating / (vm.reviews.length || 1) );
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

    function markAsRead(message) {
      if (message.unread)
        Message.markAsRead(message).then(markSuccessFn, markErrorFn);

      function markSuccessFn(data) {
        vm.unreadNumber--;
      }

      function markErrorFn(data) {
        alert('Could not mark as read.');
        console.error('Error: ' + JSON.stringify(data.data));
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
