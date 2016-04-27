(function(){
  'use strict'

  angular
    .module('thingy.posts.directives')
    .directive('imageUpload', imageUpload);

    imageUpload.$inject = ['$parse'];

    function imageUpload($parse) {
      var directive = {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var model = $parse(attrs.imageUpload);
          var modelSetter = model.assign;

          element.bind('change', function(){
            scope.$apply(function(){
              modelSetter(scope, element[0].files[0]);
            });
          });
        }
      };
    return directive;
  }
})();
