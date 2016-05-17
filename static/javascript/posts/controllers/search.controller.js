(function(){
  'use strict'

  angular
    .module('thingy.posts.controllers')
    .controller('SearchController', SearchController);

  SearchController.$inject = ['$rootScope', '$scope', 'Posts', '$route', '$cookies', '$location', '$sce'];

  function SearchController($rootScope, $scope, Posts, $route, $cookies, $location, $sce) {
    var vm = this;

    // Function and Data
    vm.posts = [];
    vm.categories = [];
    vm.regions = [];
    vm.conditions = [];
    vm.search = search;
    vm.selection = selection;
    vm.toggleAdvanced = toggleAdvanced;
    vm.advanced = {
      status: $location.search().advanced == 'true',
      text: $location.search().advanced == 'true' ? '<< Basic search' : 'Advanced search >>'
    }

    // Bindings
    // Empty strings to prevent errors due to undefined values
    vm.searchTerm = $location.search().search;
    vm.category = '';
    vm.subcategory = '';
    vm.minPrice = '';
    vm.maxPrice = '';
    vm.region = '';
    vm.subregion = '';
    vm.condition = '';
    vm.selectedPost;
    vm.geoloc = '';

    activate();

    function activate() {
      // Get db data by nesting callbacks
      // getAllCategories -> getAllRegions -> getAllConditions -> search
      Posts.getAllCategories().then(categoriesSuccessFn, categoriesErrorFn);

      function categoriesSuccessFn(data, status, headers, config) {
        vm.categories = data.data;
        // Url might contain search settings
        if($location.search().category)
        {
          vm.category = findObjectContainingKey(vm.categories, 'cname', $location.search().category);
          vm.subcategory = findObjectContainingKey(vm.category.subcategories, 'name', ($location.search().subcategory || ''));
        }
        // Done
        Posts.getAllRegions().then(regionsSuccessFn, regionsErrorFn);
      }

      function categoriesErrorFn(data) {
        alert('Could not load categories.');
        console.error('Error: ' + JSON.stringify(data.data));
      }

      function regionsSuccessFn(data, status, headers, config) {
        vm.regions = data.data;
        if($location.search().region)
        {
          vm.region = findObjectContainingKey(vm.regions, 'name', $location.search().region);
          vm.subregion = findObjectContainingKey(vm.region.towns, 'name', ($location.search().subregion || ''));
        }
        // Done
        Posts.getAllConditions().then(conditionsSuccessFn, conditionsErrorFn);
      }

      function regionsErrorFn(data) {
        alert('Could not load regions.');
        console.error('Error: ' + JSON.stringify(data.data));
      }

      function conditionsSuccessFn(data, status, headers, config) {
        vm.conditions = data.data;
        if($location.search().condition)
          vm.condition = findObjectContainingKey(vm.conditions, 'cond_grade', $location.search().condition);
        // This will search as specified in the url or return all posts
        vm.search();
      }

      function conditionsErrorFn(data) {
        alert('Could not load conditions.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }

    function search() {
      console.log('Searching...');
      Posts.search(
        vm.searchTerm,  // Matches Title or Description
        vm.category ? vm.category.cname : '',
        vm.subcategory ? vm.subcategory.name : '',
        vm.minPrice,
        vm.maxPrice,
        vm.region ? vm.region.name : '',
        vm.subregion ? vm.subregion.name : '',
        vm.condition ? vm.condition.cond_desc : '',
      ).then(searchSuccessFn, searchErrorFn);

      /**
      * @name postsSuccessFn
      * @desc Update posts array on view
      */
      function searchSuccessFn(data, status, headers, config) {
        vm.posts = data.data;
        console.log(data);
      }

      /**
      * @name postsErrorFn
      * @desc Show snackbar with error
      */
      function searchErrorFn(data) {
        alert('Could not proceed with the search.');
        console.error('Error: ' + JSON.stringify(data.data));
      }
    }

    function selection(thingy) {
      vm.selectedPost = thingy;
      vm.locationUrl ='https://www.google.com/maps/embed/v1/place?key=AIzaSyAu_fehsrcpOMagU3vcHVOaxbnkuxU4LLc&q=' + thingy.location_details.name + ',Sweden';
      //vm.trustedLocationUrl = $sce.getTrustedResourceUrl(vm.locationUrl);
      vm.locationUrlt = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyAu_fehsrcpOMagU3vcHVOaxbnkuxU4LLc &q= Stockholm,Sweden';
      console.log('vm.locationUrl: ' + vm.locationUrl);
    }

    // Finds which object contains value as key.
    function findObjectContainingKey(objects, key, value) {
      for(var i = 0; i < objects.length; i++)
      {
        if(objects[i][key].toLowerCase() == value.toLowerCase())
          return objects[i];
      }
      return '';
    }

    // Toggle advanced search text
    function toggleAdvanced() {
      vm.advanced.text = !vm.advanced.status ? '<< Basic search' : 'Advanced search >>';
    }
  }
})();
