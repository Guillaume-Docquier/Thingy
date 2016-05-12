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
    vm.getUnreadMessages = getUnreadMessages;
    vm.unreadNum = 0;
    vm.profile = '';
    vm.receivedMessages = [];
    vm.sentMessages = [];
    vm.posts = [];

    // Bindings
    vm.newMessage = {
      body: '',
      recipient: ''
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
      function profileErrorFn(data, status, headers, config) {
        $location.url('/');
        console.log("Error loading profile");
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
      function getRErrorFn(data, status, headers, config) {
        console.log("Error loading received messages");
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
      function postsErrorFn(data, status, headers, config) {
        console.log("Error loading Thingies");
      }
    }

    function sendMessage() {
      Message.sendMessage(vm.newMessage).then(sendSuccessFn, sendErrorFn);

      function sendSuccessFn() {
        alert('Message sent!');
      }

      function sendErrorFn(data) {
        alert('Could not send your message.');
        console.log('Error: ' + JSON.stringify(data.data));
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
