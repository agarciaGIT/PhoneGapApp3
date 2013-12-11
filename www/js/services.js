'use strict';

/* Services */

var frmServices = angular.module('frmServices', ['ngResource']);

frmServices.factory('Lessons', ['$resource',
  function($resource){
    return $resource('data/lessons.json', {}, {
      query: {method:'GET', params:{lessonId:'lessons'}, isArray:true}
    });
}]);

frmServices.factory('Readings', ['$resource',
  function($resource){
    return $resource('data/readings.json', {}, {
      query: {method:'GET', params:{readingId:'readings'}, isArray:true}
    });
}]);

frmServices.factory('Messages', ['$resource',
  function($resource){
    return $resource('data/messages.json', {}, {
      query: {method:'GET', params:{messageId:'messages'}, isArray:true}
    });
}]);

frmServices.factory('remoteDataService', ['$resource','$http',
  function($resource, $http){

    var remoteDataService = {};
    remoteDataService.$http = $http;

    //our service accepts a promise object which 
    //it will resolve on behalf of the calling function
    remoteDataService.fetchData = function(q,$http) {

      if(localStorage.frmData == 'null') {
        $http({method:'GET',url:'data/lessons.json'}).success(function(data){
           remoteDataService.data = data;
           localStorage.frmData = JSON.stringify(data);
           q.resolve();
        });        
      } else {
        remoteDataService.data = JSON.parse(localStorage.frmData);
        q.resolve();
      }
    };

   remoteDataService.commitData = function() {
      localStorage.frmData = JSON.stringify(remoteDataService.data);
   }

   remoteDataService.clearData = function() {
      localStorage.frmData = null;
   }

  return remoteDataService;

}]);

frmServices.factory('scheudlarBarSharedService', function($rootScope) {
	var sharedService = {};

	sharedService.lessonIndex = 0;
	sharedService.readingIndex = 0;
  
  sharedService.selectItem = function(item) {
  	sharedService.lessonIndex = item;
    $rootScope.$broadcast('handleSelectItem');
  };

  sharedService.doneReadingItem = function(item) {
	sharedService.readingIndex = item;
    $rootScope.$broadcast('handleDoneReadingItem');
  };
    
  return sharedService;
});

frmServices.factory('readlingListSharedService', function($rootScope) {
  var sharedService = {};
  sharedService.filters = {
    flagged: 0,
    checked: 0
  };
  sharedService.readingIndex = "";

  sharedService.setReadingIndex = function(id) {
    sharedService.readingIndex = id;
    $rootScope.$broadcast('handleSetReadingIndex');
  }

  sharedService.filterList = function(filterType) {
    sharedService.filters[filterType] = !sharedService.filters[filterType];
    //$rootScope.$broadcast('handleFilterList');
  };

  sharedService.clearFilters = function() {
    sharedService.filters = {
      flagged: 0,
      checked: 0
    };

  }

    
  return sharedService;
});