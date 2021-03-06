frmControllers.controller('FRMAppAlertsCtrl', ['$scope','$timeout','$http','remoteDataService','navigationService',
  function($scope, $timeout, $http, remoteDataService, navigationService) {

    $scope.examSites = [];
    $scope.examSites = remoteDataService.examSites;

    $scope.title = '';
    $scope.message = '';
    $scope.sound = true;

    $scope.openMode = false;
    //$scope.allMessages = remoteDataService.allMessages;

    $timeout(function() {
      navigationService.pageTransitionIn();
      $('body').removeClass("modal-open")
    }, 0);

    $scope.clear = function() {

      for(var i=0; i<$scope.examSites.length; i++) {
        $scope.examSites[i].selected=0;
      }  

      $scope.title = '';
      $scope.message = '';
      $scope.sound = true;
    }

    $scope.open = function(mode) {
      $scope.openMode = mode;      
      if(mode == true) {

        $http({method:'GET',url:'/sfdc/exam/alerts'}).success(function(data){

          $scope.allMessages = data;

        }).error(function(data, status, headers, config) {
            alert('Could not load messages!');
        });

      }
    }
    
    $scope.getEpochDateShortText = function(epochDate) {
      return getEpochDateShortText(epochDate);
    }
    
    $scope.matchSelected = function(value) {
      return function( item ) {
      	return item.selected;
      }
    }

  	$scope.selectItem = function(item) {		
  		item.selected = !item.selected;
    }

    $scope.selectMsg = function(msg) {
      $scope.title = msg.title;
      $scope.message = msg.body;

      for(var i=0; i<$scope.examSites.length; i++) {
        $scope.examSites[i].selected=0;

        var found = false;
        for(var j=0; j<msg.sites.length; j++) {
          if(msg.sites[j] == $scope.examSites[i].Id) {
            found = true;
            break;
          }
        }            
        if(found)
          $scope.examSites[i].selected=1;
      }

      $scope.openMode=false;
    }

    $scope.sendMsg = function(msg) {    

      var sendSites = [];
      for(var i=0; i<$scope.examSites.length; i++) {
        if($scope.examSites[i].selected)
          sendSites.push($scope.examSites[i].Id);
      }

      remoteDataService.sendMsg($scope.title, $scope.message, $scope.sound, sendSites, function(status,data) {

        console.log(status + ':' + data);
        
        if(status != 200) {
          alert('Could not send messages!');
        } else {
          alert('Message Sent!');
        }
      });
    }
  }
]);