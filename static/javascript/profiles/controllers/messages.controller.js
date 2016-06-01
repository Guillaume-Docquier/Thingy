(function(){
  'use strict'

  angular
    .module('thingy.profiles.controllers')
    .controller('MessagesController', MessagesController);

  MessagesController.$inject = ['Profile', 'Message', '$scope', '$rootScope'];

  function MessagesController(Profile, Message, $scope, $rootScope) {
    var vm = this;

    //Data and functions
    vm.sendMessage = sendMessage;
    vm.validate = validate;
    vm.deleteMessage = deleteMessage;
    vm.message = $scope.message;

    // Bindings
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

    function activate() {
      if (vm.message.author) {
        vm.newMessage.recipient = {
          username: vm.message.author.username,
          id: vm.message.author.id
        }
      }
      else if (vm.message.type == 'Rent request') {
        vm.newMessage.recipient = {
          username: vm.message.rentee.username,
          id: vm.message.rentee.id
        }
      }
      else {
        vm.newMessage.recipient = {
          username: vm.message.thingy_details.author.username,
          id: vm.message.thingy_details.author.id
        }
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
    * @name deleteMessage
    * @desc Delete a message
    */
    function deleteMessage() {
      Message.deleteMessage(vm.message.id, vm.message.type).then(deleteSuccessFn, deleteErrorFn);

      /**
      * @name deleteSuccessFn
      * @desc Broadcast the event and log a success message
      */
      function deleteSuccessFn(data) {
        console.log('Message deleted');
        //Broadcast the event so that profile.controller can remove the message without reloading the page
        $rootScope.$broadcast('message.deleted', vm.message);
      }

      /**
      * @name deleteErrorFn
      * @desc Log the error in the console
      */
      function deleteErrorFn(data) {
        alert('Could not delete the message.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }
  }
})();
