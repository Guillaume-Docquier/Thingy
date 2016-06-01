/**
* ProfileController
* @namespace thingy.profiles.controllers
*/
(function(){
  'use strict'

  angular
    .module('thingy.profiles.controllers')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$location', 'Profile', 'Posts', 'Message', 'Authentication', '$scope'];

  /**
  * @namespace ProfileController
  */
  function ProfileController($location, Profile, Posts, Message, Authentication, $scope) {
    var vm = this;

    // Functions and data
    vm.sendMessage = sendMessage;
    vm.validate = validate;
    vm.markAsRead = markAsRead;
    vm.refresh = refresh;
    vm.getReceivedMessages = getReceivedMessages;
    vm.unreadNumber = 0;
    vm.isOwner = true;
    vm.isAuthenticated = Authentication.isAuthenticated();
    vm.profile = '';
    vm.receivedMessages = [];
    vm.sentMessages = [];
    vm.posts = [];
    vm.reviews = [];
    vm.pendingOffers = [];
    vm.processedOffers = [];
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

      // Move a pending offer to the processed offers
      $scope.$on('offer.processed', function (event, offer) {
        for (var i = 0; i < vm.pendingOffers.length; i++)
        {
          if (vm.pendingOffers[i].id == offer.id)
          {
            vm.pendingOffers.splice(i, 1);
            break;
          }
        }
        // Add to processed offers
        vm.processedOffers.unshift(offer);
      });

      // Remove a deleted message
      $scope.$on('message.deleted', function (event, message) {
        for (var i = 0; i < vm.receivedMessages.length; i++)
        {
          // Rent messages might have same id as private messages.... Type will differentiate them
          if (vm.receivedMessages[i].id == message.id && vm.receivedMessages[i].type == message.type)
          {
            vm.receivedMessages.splice(i, 1);
            break;
          }
        }
      });

      function profileSuccessFn(data) {
        vm.profile = data.data;
        vm.refresh('thingies');
        vm.refresh('reviews');
        vm.refresh('messages');
        vm.refresh('offers');
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
            // No result -> Invalid
            if (data.data.length < 1)
            {
              vm.help.recipient = 'This user does not exit.'
              vm.newMessage.recipient.id = '';
              vm.valid.recipient = -1;
            }
            else if (vm.profile.id == data.data[0].id)
            {
              vm.help.recipient = 'You cannot message yourself';
              vm.newMessage.recipient.id = '';
              vm.valid.recipient = -1;
            }
            else
            {
              vm.help.recipient = '';
              vm.newMessage.recipient.id = data.data[0].id;
              vm.valid.recipient = 1;
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
    * @name refresh
    * @desc Refresh a part of the profile
    * @param {String} what The part of the profile to be refreshed
    */
    function refresh(what) {
      switch(what) {
        case 'thingies':
          Posts.getUserPosts(vm.profile.username).then(postsSuccessFn, postsErrorFn);
          break;
        case 'reviews':
          Profile.getReviews(vm.profile.id).then(reviewsSuccessFn, reviewsErrorFn);
          break;
        case 'messages':
          vm.getReceivedMessages();
          break;
        case 'offers':
          Profile.getOffers(vm.profile.id).then(offersSuccessFn, offersErrorFn);
          break;
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
      }

      /**
      * @name reviewsErrorFn
      * @desc Log error in the console
      */
      function reviewsErrorFn(data) {
        alert('Could not load reviews.');
        console.error('Error: ' + JSON.stringify(data.data));
      }

      /**
      * @name offersSuccessFn
      * @desc Update 'offers' on viewmodel
      */
      function offersSuccessFn(data) {
        var offers = data.data;
        vm.pendingOffers = [];
        vm.processedOffers = [];
        // Sort pending / accepted or decline
        for (var i = 0; i < offers.length; i++)
        {
          if (offers[i].status == 'Pending') vm.pendingOffers.push(offers[i]);
          else vm.processedOffers.push(offers[i]);
        }
      }

      /**
      * @name offersErrorFn
      * @desc Log error in the console
      */
      function offersErrorFn(data) {
        alert('Could not load reviews.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }

    /**
    * @name getReceivedMessages
    * @desc Fetch system and private messages (Nested calls).
    */
    function getReceivedMessages() {
      var unread = 0;
      var messages = [];
      Message.getSystemMessages().then(getSMSuccessFn, getSMErrorFn);

      /**
      * @name getSMSuccessFn
      * @desc Concat to the list of messages
      */
      function getSMSuccessFn(SMs) {
        // Get number of unread messages and push to list
        for(var i = 0; i < SMs.data.length; i++)
        {
          if (SMs.data[i].unread) unread++;
          messages.push(SMs.data[i]);
        }
        Message.getPrivateMessages().then(getPMSuccessFn, getPMErrorFn);

        /**
        * @name getPMSuccessFn
        * @desc Concat to the list of messages and sort the list.
        */
        function getPMSuccessFn(PMs) {
          // Get number of unread messages and push to list
          for(var i = 0; i < PMs.data.length; i++)
          {
            if (PMs.data[i].unread) unread++;
            messages.push(PMs.data[i]);
          }
          messages.sort(sortByDate);
          // Apply
          vm.unreadNumber = unread;
          vm.receivedMessages = messages;

          /**
          * @name sortByDate
          * @desc Sort array by dates, most recent first.
          */
          function sortByDate(a, b) {
            return new Date(b.created_at) - new Date(a.created_at);
          }
        }

        /**
        * @name getPMErrorFn
        * @desc Notify of error and log in console.
        */
        function getPMErrorFn(data) {
          alert('Could not fetch received messages.');
          console.error('Error: ' + JSON.stringify(data.data));
        }
      }

      /**
      * @name getSMErrorFn
      * @desc Notify of error and log in console.
      */
      function getSMErrorFn(data) {
        alert('Could not fetch received messages.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }
  }
})();
