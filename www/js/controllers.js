'use strict';

function tellAngular() {
    console.log("tellAngular call");
    var domElt = document.getElementById('view-container');
    var scope = angular.element(domElt).scope();
    scope.$apply(function() {
        scope.width = window.innerWidth;
        scope.height = window.innerHeight;
    });
    var nhRead = window.innerHeight - 240;
    var nhMsg = window.innerHeight - 430;
    $(".readingscrollregion").css("height", nhRead + "px");
    $(".msgscrollregion").css("height", nhMsg + "px");
}


//first call of tellAngular when the dom is loaded
document.addEventListener("DOMContentLoaded", tellAngular, false);

//calling tellAngular on resize event
window.onresize = tellAngular;


/* Controllers */
var frmControllers = angular.module('frmControllers', []);

frmControllers.controller('NavController', ['$scope', '$location',
  function($scope, $location) {
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };    
  }
]);

frmControllers.controller('FRMAppLoginCtrl', ['$scope', '$location','remoteDataService',
  function($scope, $location, remoteDataService) {
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };

    $scope.clearData = function() {
      remoteDataService.clearData();
    }
  }
]);



frmControllers.controller('ScheduleBarController', ['$scope', '$location','Readings', 'Messages','Lessons','scheudlarBarSharedService','remoteDataService',
  function($scope, $location, Readings, Messages, Lessons, scheudlarBarSharedService, remoteDataService) {

    $scope.lessons = remoteDataService.frmData;
    $scope.readings = $scope.lessons[0].readings;

  	$scope.isActive = function (viewLocation) { 
          return viewLocation === $location.path();
      };
  	
  	$scope.itemSelect = function(item) {
  		$scope.selected = item;
  		scheudlarBarSharedService.selectItem(item);
      };

  	$scope.isItemSelected = function(item) {
  		if(item == $scope.selected) {
  			return 1;
  		} else {
  			return 0;
  		}
  	};

    $scope.filterMatch = function( criteria ) {
      return function( item ) {
        var li = scheudlarBarSharedService.lessonIndex;
        return $scope.lessons[li].readings[criteria.index][criteria.field] == criteria.value;
      };
    };
    
  	$scope.$on('handleDoneReadingItem', function() {
  		var li = scheudlarBarSharedService.lessonIndex;
  		var ri = scheudlarBarSharedService.readingIndex;
  		
  		if($scope.lessons[li].readings[ri].checked) {
  			$scope.lessons[li].readings[ri].checked = 0;
  		} else {
  			$scope.lessons[li].readings[ri].checked = 1;
  		}
  	});
  	
  	$scope.isItemInProgress = function(id) {

      var lesson = _.findWhere(remoteDataService.frmData, {id: id});

      if(lesson !== null && typeof lesson !== "undefined") {

        var readings = lesson.readings;
        var readingsIds = _.pluck(readings, 'id');

        var meta = _.where(remoteDataService.userMeta, {checked: true});
        if(meta !== null || typeof meta !== "undefined" && readingsIds !== null && typeof readingsIds !== "undefined") {
          var metaIds = _.pluck(meta, 'id');
          var inter = _.intersection(readingsIds,metaIds)

          if(inter.length > 0)
            return true
          else return false;

        } else {
          return false;
        }

      } else {
        return false;
      }
  	};

  	$scope.isItemDone = function(id) {
      var lesson = _.findWhere(remoteDataService.frmData, {id: id});

      if(lesson !== null && typeof lesson !== "undefined") {

        var readings = lesson.readings;
        var readingsIds = _.pluck(readings, 'id');

        var meta = _.where(remoteDataService.userMeta, {checked: true});
        if(meta !== null || typeof meta !== "undefined" && readingsIds !== null && typeof readingsIds !== "undefined") {
          var metaIds = _.pluck(meta, 'id');
          var inter = _.intersection(readingsIds,metaIds)

          if(inter.length == readingsIds.length)
            return true
          else return false;

        } else {
          return false;
        }

      } else {
        return false;
      }
    }
  }
]);


frmControllers.controller('FRMAppReadingsListCtrl', ['$scope','scheudlarBarSharedService','remoteDataService','readlingListSharedService',
  function($scope, scheudlarBarSharedService, remoteDataService, readlingListSharedService) {
  
    //$scope.lessons = Lessons.query();
    $scope.lessons = remoteDataService.frmData;
    $scope.readings = $scope.lessons[0].readings;
    $scope.lessonIndex = scheudlarBarSharedService.lessonIndex;


    // Readings List
    $scope.itemClicked = function (id, type) {

      readlingListSharedService.setReadingIndex(id);

      // New Queue
      var found = 0;
      var foundItem = _.findWhere(remoteDataService.userMeta, {id: id});
      if(foundItem === null || typeof foundItem === "undefined") {
        var newItem = {id: id};
        newItem[type] = true;
        remoteDataService.userMeta.push(newItem);
      } else {
        foundItem[type]=!foundItem[type];
      }

      remoteDataService.commitData();
    };
  
    $scope.isItemClicked = function (id, type) { 

      // New Queue
      var found = 0;
      var foundItem = _.findWhere(remoteDataService.userMeta, {id: id});
      if(foundItem === null || typeof foundItem === "undefined") {
        return false;
      } else {
        return foundItem[type];
      }

    }

    $scope.getSelectedLessonIndex = function ($index) { 
      return scheudlarBarSharedService.lessonIndex;;
    }

    $scope.criteriaMatch = function(value) {
      return function( item ) {

        // New Queue  
        var foundItem = _.findWhere(remoteDataService.userMeta, {id: item.id});        

        if(foundItem !== null && typeof foundItem !== "undefined") {

          if(readlingListSharedService.filters.flagged && readlingListSharedService.filters.checked) {
            return (foundItem.flagged === true && foundItem.checked === true);
          } else if(readlingListSharedService.filters.flagged) {
            return foundItem.flagged === true;
          } else if(readlingListSharedService.filters.checked) {
            return foundItem.checked === true;
          } else {
            return 1;  
          }
        } else {
          return 1;
        }
        
      }
    }   

    $scope.$on('handleSelectItem', function() {
      if($scope.lessonIndex != scheudlarBarSharedService.lessonIndex) {
        $scope.lessonIndex = scheudlarBarSharedService.lessonIndex;
        $('.readings-list-area').hide("fast", function() {
          $('.readings-list-area').show("fast", function() {
          //alert( "Animation complete." );
          });
        });
      }      

  });       


  }
]);


frmControllers.controller('FRMReadings', ['$scope','scheudlarBarSharedService','remoteDataService','readlingListSharedService',
  function($scope, scheudlarBarSharedService, remoteDataService,readlingListSharedService) {
  
    //$scope.lessons = Lessons.query();
    $scope.lessons = remoteDataService.frmData;
    $scope.readings = $scope.lessons[0].readings;
    $scope.lessonIndex = scheudlarBarSharedService.lessonIndex;
    $scope.currentReading=null;

    // For Readings
    $scope.selectedReadingArray = [];
    $scope.filterList = function(filterType,value) {
      readlingListSharedService.filterList(filterType);      
    }

    $scope.getSelectedLesson = function ($index) { 
      var li = scheudlarBarSharedService.lessonIndex;
      return $scope.lessons[li].readings[$index];
    }

    $scope.getSelectedLessonIndex = function ($index) { 
      return scheudlarBarSharedService.lessonIndex;
    }


    $scope.isFilterOn = function(type) {
      return readlingListSharedService.filters[type];
    }

    $scope.$on('handleSetReadingIndex', function() {
      var li = scheudlarBarSharedService.lessonIndex;
      var readings = $scope.lessons[li].readings;

      var found = 0;
      var foundItem = _.findWhere(readings, {id: readlingListSharedService.readingIndex});
      if(foundItem)
        $scope.currentReading = foundItem;
      else $scope.currentReading = null;
    });

  }
]);


frmControllers.controller('FRMAppDashCtrl', ['$scope', 'Readings', 'Messages','Lessons','scheudlarBarSharedService','remoteDataService','readlingListSharedService',
  function($scope, Readings, Messages, Lessons, scheudlarBarSharedService, remoteDataService, readlingListSharedService) {
  
  	//$scope.lessons = Lessons.query();
    $scope.lessons = remoteDataService.frmData;
    $scope.readings = $scope.lessons[0].readings;

    $scope.messages = Messages.query();
  	
  	$scope.lessonIndex = scheudlarBarSharedService.lessonIndex;

    readlingListSharedService.clearFilters();

    $scope.$watchCollection('lessons', function() { 
      //alert('change');
    });


    // Init height;
    var nhRead = window.innerHeight - 240;
    var nhMsg = window.innerHeight - 430;
    $(".readingscrollregion").css("height", nhRead + "px");
    $(".msgscrollregion").css("height", nhMsg + "px");

    
    $scope.go = function() {
      $scope.msgread = 'msgread';
    }
    
    // For Messages
    $scope.selectedMessageArray = [];

    $scope.getSelectedLesson = function ($index) { 
      var li = scheudlarBarSharedService.lessonIndex;
      return $scope.lessons[li].readings[$index];
    }
   
    $scope.getSelectedLessonIndex = function ($index) { 
      return scheudlarBarSharedService.lessonIndex;;
    }


    $scope.$on('handleSetReadingIndex', function() {
      var li = scheudlarBarSharedService.lessonIndex;
      var readings = $scope.lessons[li].readings;

      var found = 0;
      var foundItem = _.findWhere(readings, {id: readlingListSharedService.readingIndex});
      if(foundItem)
        $scope.currentReading = foundItem;
      else $scope.currentReading = null;
    });

  }
]);


frmControllers.controller('FRMReadingsCtrl', ['$scope',
  function($scope) {
    
    $('ul.nav').find('li').removeClass('active')
    $('#mainnav-readings').addClass('active');
  }
]);



/*
frmControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
  function($scope, $routeParams, Phone) {
    $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
      $scope.mainImageUrl = phone.images[0];
    });

    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    }
  }]);
*/