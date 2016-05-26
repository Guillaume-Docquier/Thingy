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
    vm.getReceivedMessages = getReceivedMessages;
    vm.unreadNumber = 0;
    vm.isOwner = true;
    vm.isAuthenticated = Authentication.isAuthenticated();
    vm.profile = '';
    vm.receivedMessages = [];
    vm.sentMessages = [];
    vm.posts = [];
    vm.reviews = [];
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
        vm.getReceivedMessages();
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
          // Format dates
          for(var i = 0; i < vm.reviews.length; i++)
            vm.reviews[i].created = moment(vm.reviews[i].created).format('MMMM Do HH:mm');
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
      * @name profileErrorFn
      * @desc Log error in the console
      */
      function profileErrorFn(data) {
        alert('Could not load profile.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }


    /**
    * @name sendMessage
    * @desc Send a private message to another user.
    */
    function sendMessage() {
      if (!formIsValid())
      {
        alert('Some information is missing.');
        return;
      }
      Message.sendMessage(
        vm.newMessage.body,
        vm.newMessage.recipient.id
      ).then(sendSuccessFn, sendErrorFn);

      /**
      * @name sendSuccessFn
      * @desc Display success message.
      */
      function sendSuccessFn() {
        alert('Message sent!');
      }

      /**
      * @name sendErrorFn
      * @desc Display an error message and log the details in the console.
      */
      function sendErrorFn(data) {
        alert('Could not send your message.');
        console.error('Error: ' + JSON.stringify(data.data));
      }


      /**
      * @name formIsValid
      * @desc Check if all fields are valid.
      */
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
    * @desc Validate input depending on type
    * @param {String} type The type of input to validate
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
              vm.newMessage.recipient.id = data.data[0].id;
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

    /**
    * @name markAsRead
    * @desc Mark a message as read if it can.
    */
    function markAsRead(message) {
      if (message.unread)
      {
        message.unread = false;
        Message.markAsRead(message).then(markSuccessFn, markErrorFn);
      }

      /**
      * @name markSuccessFn
      * @desc Update the number of unread messages.
      */
      function markSuccessFn(data) {
        vm.unreadNumber--;
      }

      /**
      * @name markErrorFn
      * @desc Notify of error and log in console.
      */
      function markErrorFn(data) {
        message.unread = true;
        alert('Could not mark as read.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }

    /**
    * @name getReceivedMessages
    * @desc Fetch system and private messages.
    */
    function getReceivedMessages() {
      Message.getSystemMessages().then(getMessagesSuccessFn, getMessagesErrorFn);
      Message.getPrivateMessages().then(getMessagesSuccessFn, getMessagesErrorFn);

      /**
      * @name getMessagesSuccessFn
      * @desc Concat to the list of messages and sort the list.
      */
      function getMessagesSuccessFn(data) {
        vm.receivedMessages = vm.receivedMessages.concat(data.data);
        vm.receivedMessages.sort(sortByDate);

        /**
        * @name sortByDate
        * @desc Sort array by dates, most recent first.
        */
        function sortByDate(a, b) {
          return new Date(b.created_at) - new Date(a.created_at);
        }
      }

      /**
      * @name getMessagesErrorFn
      * @desc Notify of error and log in console.
      */
      function getMessagesErrorFn(data) {
        alert('Could not fetch received messages.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }
  }
})();
