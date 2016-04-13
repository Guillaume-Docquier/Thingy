/**
* NewPostController
* @namespace thinkster.posts.controllers
*/
(function () {
  'use strict';


  angular
    .module('thinkster.posts.controllers')
    .controller('NewPostController', NewPostController);

  NewPostController.$inject = ['$rootScope', '$scope', 'Authentication', 'Snackbar', 'Posts'];

  angular
    .module('thinkster.posts.controllers').run(function($rootScope, $route, $location){
      //Bind the `$locationChangeSuccess` event on the rootScope, so that we dont need to
      //bind in induvidual controllers.
      console.log("Got ya!");
      $rootScope.$on('$locationChangeSuccess', function() {
        $rootScope.actualLocation = $location.path();
      });

      $rootScope.$watch(function () {return $location.path()}, function (newLocation, oldLocation) {
        if($rootScope.actualLocation === newLocation) {
            alert('Why did you use history back?');
        }
      });
    });

  /**
  * @namespace NewPostController
  */
  function NewPostController($rootScope, $scope, Authentication, Snackbar, Posts) {
    var vm = this;

    vm.submit = submit;

    /*console.log("here");
    $rootScope.$on('$routeChangeStart', function (scope, next, current) {
      console.log("So smart!");
      $scope.closeThisDialog();
    });

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    //Open the modal
    $('my-modal').show();
  });*/

    /**
    * @name submit
    * @desc Create a new Post
    * @memberOf thinkster.posts.controllers.NewPostController
    */
    function submit() {
      $rootScope.$broadcast('post.created', {
        content: vm.content,
        author: {
          username: Authentication.getAuthenticatedAccount().username
        }
      });

      $scope.closeThisDialog();

      Posts.create(vm.content).then(createPostSuccessFn, createPostErrorFn);


      /**
      * @name createPostSuccessFn
      * @desc Show snackbar with success message
      */
      function createPostSuccessFn(data, status, headers, config) {
        Snackbar.show('Success! Post created.');
      }


      /**
      * @name createPostErrorFn
      * @desc Propogate error event and show snackbar with error message
      */
      function createPostErrorFn(data, status, headers, config) {
        $rootScope.$broadcast('post.created.error');
        Snackbar.error(data.error);
      }
    }
  }
})();
