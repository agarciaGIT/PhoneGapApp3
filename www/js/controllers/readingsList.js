
frmControllers.controller('FRMAppReadingsListCtrl', ['$scope','$timeout', 'scheduleBarSharedService','remoteDataService','readlingListSharedService','$filter',
  function($scope, $timeout, scheduleBarSharedService, remoteDataService, readingListSharedService, $filter) {
  
    $scope.readingsList = readingListSharedService

    //$scope.lessons = Lessons.query();
    $scope.lessons = remoteDataService.lessonData;
    $scope.lessonIndex = scheduleBarSharedService.lessonIndex;

    if(scheduleBarSharedService.lessonIndex == 'all') {
      $scope.currentLesson = {id:'all', title:'All Readings'};
      $scope.readings = _.flatten(_.pluck(remoteDataService.lessonData,'readings'))
      //$scope.readings = _.reject(allReadings, function(ar){ return typeof ar.id === "undefined"; });
    } else {    
      $scope.currentLesson = _.findWhere(remoteDataService.lessonData, {id: $scope.lessonIndex});
      $scope.readings = $scope.currentLesson.readings
    }

    $scope.$on('handleTopicSelectItem', function() {
      if($scope.lessonIndex != scheduleBarSharedService.lessonIndex) {

          $scope.lessonIndex = scheduleBarSharedService.lessonIndex;

          if($scope.lessonIndex == 'all') {
            $scope.currentLesson = {id:'all', title:'All Readings'};
            $scope.readings = _.flatten(_.pluck(remoteDataService.lessonData,'readings'))
            //$scope.readings = _.reject(allReadings, function(ar){ return typeof ar.id === "undefined"; });

          } else {
            var lesson = _.findWhere(remoteDataService.lessonData, {id: $scope.lessonIndex});
            if(lesson !== null && typeof lesson !== "undefined") {          
              $scope.currentLesson = lesson;
              $scope.readings = lesson.readings;
            }            
          }
      }
    });

    // Readings List
    $scope.itemClicked = function (id, type) {
      readingListSharedService.setReadingIndex(id);
      remoteDataService.toggelReadingAttribute(id, type);
    };
  
    $scope.isItemClicked = function (id, type) { 

      var foundItem = remoteDataService.getReadingByID(id);
      if(foundItem === null || typeof foundItem === "undefined") {
        return false;
      } else {
        return foundItem[type];
      }

    }

    $scope.getSelectedLessonIndex = function ($index) { 
      return scheduleBarSharedService.lessonIndex;
    }

    $scope.getNumberOfNotes = function(id) {

      var foundItem = remoteDataService.getReadingByID(id);
      if(foundItem !== null && typeof foundItem !== "undefined" &&
        foundItem.notes !== null && typeof foundItem.notes !== "undefined") {
        return foundItem.notes.length;
      } else {
        return 0;
      }
    }

  }
])

frmControllers.filter('filterByReadingListProps', ['remoteDataService', function(remoteDataService){
    return function(input, filter, property){

        var output = []

        if(filter !== undefined && filter){

            angular.forEach(input, function(item){
              angular.forEach(remoteDataService.metaData, function(metadata){

                if(metadata.readingId == item.id && !Array.isArray(metadata[property]) && metadata[property]){
                  output.push(item)
                }else if(metadata.readingId == item.id && Array.isArray(metadata[property]) && metadata[property].length){
                  output.push(item)
                }

              })
            })

        }else{

            output = input

        }

        return output

    }
}])