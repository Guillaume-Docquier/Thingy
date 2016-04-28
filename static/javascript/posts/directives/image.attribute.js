(function(){
  'use strict'

  angular
    .module('thingy.posts.directives')
    .directive('fileUpload', fileUpload);

  function fileUpload() {
    var directive = {
      scope: true,        //create a new scope
      link: function (scope, el, attrs) {
        el.bind('change', function (event) {
          var files = event.target.files;
          //iterate files since 'multiple' may be specified on the element
          for (var i = 0;i<files.length;i++) {
            //emit event upward
            scope.$emit("fileSelected", { file: files[i] });
          }
        });
      }
    };
    return directive;
  }
})();
