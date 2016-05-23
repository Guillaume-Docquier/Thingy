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
    vm.validate = validate;
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
    vm.valid = {
      recipient: 0,
      body: 0
    };
    vm.help = {
      recipient: '',
      body: ''
    };

    // Bindings
    vm.newMessage = {
      body: '',
      recipient: {
        username: '',
        id: ''
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
      else Profile.get(Authentication.getAuthenticatedAccount().username).then(profileSuccessFn, profileErrorFn);

      function profileSuccessFn(data) {
        vm.profile = data.data;
        Posts.getUserPosts(vm.profile.username).then(postsSuccessFn, postsErrorFn);
        Profile.getReviews(vm.profile.id).then(reviewsSuccessFn, reviewsErrorFn);
        Message.getReceivedMessages().then(getRSuccessFn, getRErrorFn);
        //Message.getSentMessages(vm.profile.id).then(getSSucessFn, getSErrorFn);

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

      function profileErrorFn(data) {
        alert('Could not load profile.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }

    /**
    * @name sendMessage
    * @desc Send a private message to another user
    */
    function sendMessage() {
      if (!formIsValid())
      {
        alert('Some information is missing.');
        return;
      }
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

      function formIsValid() {
        var valid = 1;
        for (var key in vm.valid) {
          if (vm.valid.hasOwnProperty(key) && vm.valid[key] != 1)
          {
            valid = 0;
            vm.valid[key] = -1; // Set empty fields to errors
          }
        }
        return valid;
      }
    }

    /**
    * @name validate
    * @desc Send a request to the db to verify if this username exists
    */
    function validate(type) {
      switch(type) {
        case 'recipient':
          if (vm.newMessage.recipient.username.length == 0)
          {
            vm.help.recipient = 'You need a recipient.';
            vm.newMessage.recipient.id = '';
            vm.valid.recipient = -1;
          }
          else Profile.usernameAvailable(vm.newMessage.recipient.username).then(querySuccessFn, queryErrorFn);

          /**
          * @name querySuccessFn
          * @desc Update 'newMessage' in the viewmodel
          */
          function querySuccessFn(data) {
            // Username is valid because it was found
            if (data.data.length > 0)
            {
              vm.help.recipient = '';
              vm.newMessage.recipient.id = data.data.id;
              vm.valid.recipient = 1;
            }
            else
            {
              vm.help.recipient = 'This user does not exit.'
              vm.newMessage.recipient.id = '';
              vm.valid.recipient = -1;
            }
          }

          /**
          * @name queryErrorFn
          * @desc Log the error in the console
          */
          function queryErrorFn(data) {
            alert('Error checking availability.');
            console.error('Error: ' + JSON.stringify(data.data));
          }
          break;
        case 'body' :
          if (!vm.newMessage.body)
          {
            vm.help.body = 'You did not write a message!';
            vm.valid.body = -1;
          }
          else
          {
            vm.help.body = '';
            vm.valid.body = 1;
          }
          break;
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
