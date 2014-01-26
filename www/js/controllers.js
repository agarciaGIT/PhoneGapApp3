'use strict';

function tellAngular() {
    console.log("tellAngular call");
    var domElt = document.getElementById('view-container');
    var scope = angular.element(domElt).scope();
    scope.$apply(function() {
        scope.width = window.innerWidth;
        scope.height = window.innerHeight;
        scope.$broadcast('browserResize');
    });
    var nhRead = window.innerHeight - 240;
    var nhMsg = window.innerHeight - 430;
    if(window.innerWidth > 995) {
     $(".readingscrollregion").css("height", nhRead + "px");
     $(".msgscrollregion").css("height", nhMsg + "px");
    }
}


var opts = {
  lines: 13, // The number of lines to draw
  length: 20, // The length of each line
  width: 10, // The line thickness
  radius: 30, // The radius of the inner circle
  corners: 0.5, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb or array of colors
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};

// $(document).ready(function(){
//   console.log('ready!');
// });


//first call of tellAngular when the dom is loaded
document.addEventListener("DOMContentLoaded", tellAngular, false);

//calling tellAngular on resize event
window.onresize = tellAngular;


var minWidth = 400; // Min width before we remove text


/* Controllers */
var frmControllers = angular.module('frmControllers', []);

frmControllers.controller('NavController', ['$scope', '$location','remoteDataService',
  function($scope, $location,remoteDataService) {

    $scope.innerWidth = window.innerWidth;
    $scope.innerHeight = window.innerHeight;
    $scope.searchTerms = "";

    switch(document.location.hash) {
      case '#/readings':
        $scope.currentMenuItem = 'Readings';
        break;
      case '#/examsettings':
        $scope.currentMenuItem = 'Tests';
        break;
      case '#/dash':
        $scope.currentMenuItem = 'Dashboard';
        break;
      case '#/examday':
        $scope.currentMenuItem = 'Exam Details';
        break;
      case '#/messages':
        $scope.currentMenuItem = 'Messages';
        break;
      case '#/glossary':
        $scope.currentMenuItem = 'Glossary';
        break;
      default:
        $scope.currentMenuItem = 'Dashboard';
        break;
    }

    $scope.$on('browserResize', function() {
      $scope.innerWidth = window.innerWidth;
      $scope.innerHeight = window.innerHeight;
    });

    $scope.searchGlossary = function(terms) {
      remoteDataService.searchTerms = terms;
      $scope.changeView('glossary');
    }

    $scope.changeView = function(view) {
      pageTransitionOut(view);
    }

    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };    
  }
]);

var pageTransitionOut = function(view) {
  $('.page-container').fadeOut(function() {
    if(view !== null && typeof view !== "undefined") {
      document.location.hash = '#/' + view;
    }
  });
  

  //$('.page-container').hide("slide", { direction: "right" }, 500
}

var pageTransitionIn = function() {
  //$('.page-container').show("slide", { direction: "left" }, 500); 
  $('.page-container').fadeIn();
}


frmControllers.controller('FooterNavController', ['$scope', '$timeout', '$location','remoteDataService',
  function($scope, $timeout, $location, remoteDataService) {

    $scope.innerWidth = window.innerWidth;
    $scope.innerHeight = window.innerHeight;
    $scope.showFooter = remoteDataService.showFooter;

    var offset = 75; // height of footer in CSS
    if(window.innerWidth  <= minWidth) {
        offset = 50;
        $('.nav-footer').css('height','50px');
        $('.nav-footer-item-text').hide();
        $('.nav-footer-control-off-icon').css('margin-top','15px');
    }

    $('.nav-footer').hide();
    $('.nav-footer-control').hide();
    $('.nav-footer-control-off').hide();
    
    $('#footer').css('top',($scope.innerHeight-offset));
    $('.nav-footer-control').css('top',($scope.innerHeight-offset));
    $('.nav-footer-control-off').css('top',($scope.innerHeight-offset));
    

    // show footer
    //$timeout(function() {
      if(window.innerWidth <= 995) {

        if($scope.showFooter) {
          $('.nav-footer').show();
          $('.nav-footer-control').show();
          $('.nav-footer-control-off').hide();
        } else {
          $('.nav-footer').hide();
          $('.nav-footer-control-off').show();
        }
      }
    //, 300);


    $scope.$on('browserResize', function() {

      $scope.innerWidth = window.innerWidth;
      $scope.innerHeight = window.innerHeight;

      if(window.innerWidth  <= minWidth) {
        offset = 50;
        $('.nav-footer').css('height','50px');
        $('.nav-footer-control-off-icon').css('margin-top','15px');          
        $('.nav-footer-item-text').hide();
      } else {
        offset = 75;
        $('.nav-footer').css('height','75px');
        $('.nav-footer-item-text').show();
      }


      $('#footer').css('top',($scope.innerHeight-offset));
      $('.nav-footer-control').css('top',($scope.innerHeight-offset));
      $('.nav-footer-control-off').css('top',($scope.innerHeight-offset));

      if(window.innerWidth > 995) {
        if($('.nav-footer').css('display') !== "none") {
          $('.nav-footer').hide();
          $('.nav-footer-control-off').hide();
        }
      } else {
        if($('.nav-footer').css('display') === "none") {

          if($scope.showFooter) {
            
            $timeout(function() {
              $('.nav-footer').show("slow", function() {
                $('.nav-footer-control').show("slow");
              });
            }, 1000);

          } else {
            $('.nav-footer-control-off').show("slow");
          }
        }
      }

    });

    $scope.closeFooter = function() {
      $scope.showFooter = remoteDataService.showFooter = false;
      $('.nav-footer').hide("slow");
      $('.nav-footer-control').hide("slow");
      $('.nav-footer-control-off').show("slow");
    }


    $scope.openFooter = function() {
      $scope.showFooter = remoteDataService.showFooter = true;      
      $('.nav-footer-control-off').hide("slow");
      $('.nav-footer').show("slow", function() {
        $('.nav-footer-control').show("slow");
      });
    }

    $scope.changeView = function(view) {
      pageTransitionOut(view);
    }
  }


]);

frmControllers.controller('FRMAppLoginCtrl', ['$scope', '$timeout','$location','remoteDataService',
  function($scope, $timeout, $location, remoteDataService) {

    $timeout(function() {
      $('.page-container').show("slide", { direction: "left" }, 500); 
    }, 0);

    $scope.userAgent = navigator.userAgent;

      if( /Android/i.test(navigator.userAgent) ) {
        $('.input-group-addon').hide();
        $('.login-area').find('div').removeClass('input-group')
      }


    $("video").bind("ended", function() {
       $('.videoplayer').hide("slow");
       $('.videoimage').show("slow");
       $timeout(function() {
          $('.videoplaybutton').show("slow");
       }, 3000);
    });

    $scope.playVideo=function() {
      $('.videoplaybutton').hide("slow");
      $('.videoimage').hide("slow");
      $('.videoplayer').show("slow");
      var video = $('.videoplayer').get(0);
      video.play();
    }

    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };

  }
]);

frmControllers.controller('FRMAppMyAccountCtrl', ['$scope', '$timeout', '$location','remoteDataService','scheduleBarSharedService',
  function($scope, $timeout, $location, remoteDataService, scheduleBarSharedService) {

    $scope.nav = navigator.appCodeName;
    $scope.camera =  navigator.camera;
    $scope.deviceReady =  false;
    $scope.camerror = "";
    $scope.camdata = "";
    $scope.pictureSource = pictureSource;
    $scope.destinationType = destinationType;
    $scope.userData = remoteDataService.userData;
    $scope.lessons = remoteDataService.lessonData;
    $scope.lessonIndex = 0;
    $scope.currentLesson = {};

    $scope.orgOptions = [{
          name: 'Week',
          value: 'week'
      }, {
         name: 'Topic',
         value: 'topic'
      }];

    $scope.orgOption = _.findWhere($scope.orgOptions, {value: $scope.userData.settings.organizeBy })

    $timeout(function() {
      pageTransitionIn();
    }, 0);

    scheduleBarSharedService.allMode = false;

    $scope.$on('handleScheduleBarSelectItem', function() {
      if($scope.lessonIndex != scheduleBarSharedService.lessonIndex) {
        $scope.lessonIndex = scheduleBarSharedService.lessonIndex;
        var lesson = _.findWhere(remoteDataService.lessonData, {id: $scope.lessonIndex});
        $scope.currentLesson = lesson;
      }
    });

    if(remoteDataService.userInfo.photo !== null && typeof remoteDataService.userInfo.photo !== "undefined") {
      $("#userImage").attr("src",remoteDataService.userInfo.photo);
    }

    if(navigator.camera === null || typeof navigator.camera === "undefined") {
      $('#takePhoto').hide();
    }

    $scope.takePhoto = function () { 
      if(navigator.camera !== null && typeof navigator.camera !== "undefined") {
        navigator.camera.getPicture(onPhotoFileSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
      } else {
        onFail('navigator.camera not defined!');
      }
    };

    function onPhotoFileSuccess(imageData) {
      $("#userImage").attr("src",imageData);
      remoteDataService.userInfo.photo = imageData;
    };

    function onFail(message) {
      $scope.camerror=message;
    };

    $scope.clearData = function() {
      remoteDataService.clearData();
      document.location.hash = '#/login';
    }

    $scope.changeOrgOption = function() {
      remoteDataService.changeOrgOption($scope.orgOption.value);
      $scope.$broadcast('changeOrgOption');
    }

  }
]);



frmControllers.controller('ScheduleBarController', ['$scope', '$location','Readings', 'Messages','Lessons','scheduleBarSharedService','remoteDataService',
  function($scope, $location, Readings, Messages, Lessons, scheduleBarSharedService, remoteDataService) {

    $scope.lessons = remoteDataService.lessonData;
    $scope.readings = $scope.lessons[0].readings;
    $scope.scrollIndex = 1;
    $scope.allMode = scheduleBarSharedService.allMode;

    $scope.innerWidth = window.innerWidth;
    $scope.innerHeight = window.innerHeight;

    // init ScheduleBar
    if(scheduleBarSharedService.lessonIndex == 'all') {
       var lesson = {id:'all', title:'All Lessons'};
    } else {    
      var lesson = remoteDataService.getFirstLesson();
    }

    scheduleBarSharedService.lessonIndex = lesson.id;
    $scope.selected = lesson.id;
    scheduleBarSharedService.selectItem(lesson.id);


    $scope.$on('changeOrgOption', function() {
      $scope.lessons = remoteDataService.lessonData;
      $scope.readings = $scope.lessons[0].readings;
      $scope.scrollIndex = 1;      
    });


  	$scope.isActive = function (viewLocation) { 
          return viewLocation === $location.path();
      };
  	
  	$scope.itemSelect = function(item) {
  		$scope.selected = item;
  		scheduleBarSharedService.selectItem(item);
      };

  	$scope.isItemSelected = function(item) {
  		if(item == $scope.selected) {
  			return 1;
  		} else {
  			return 0;
  		}
  	};

    $scope.scrollRight=function() {
      if($scope.scrollIndex < $scope.lessons.length)
        $scope.scrollIndex++;
    }
    $scope.scrollLeft=function() {
      if($scope.scrollIndex > 0)
        $scope.scrollIndex--;
    }

    $scope.filterMatch = function( criteria ) {
      return function( item ) {
        return (item.order >= $scope.scrollIndex);
      };
    };
    
  	$scope.$on('handleDoneReadingItem', function() {
  		var li = scheduleBarSharedService.lessonIndex;
  		var ri = scheduleBarSharedService.readingIndex;
  		
  		if($scope.lessons[li].readings[ri].checked) {
  			$scope.lessons[li].readings[ri].checked = 0;
  		} else {
  			$scope.lessons[li].readings[ri].checked = 1;
  		}
  	});

    $scope.$on('browserResize', function() {
      $scope.innerWidth = window.innerWidth;
      $scope.innerHeight = window.innerHeight;

      // if($scope.innerWidth >= 1200) {
      //     $scope.scrollIndex = 1;
      // }
    });

  	$scope.isItemInProgress = function(id) {

      var lesson = _.findWhere(remoteDataService.lessonData, {id: id});

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
      var lesson = _.findWhere(remoteDataService.lessonData, {id: id});

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


frmControllers.controller('FRMAppReadingsListCtrl', ['$scope','$timeout', 'scheduleBarSharedService','remoteDataService','readlingListSharedService',
  function($scope, $timeout, scheduleBarSharedService, remoteDataService, readlingListSharedService) {
  
    //$scope.lessons = Lessons.query();
    $scope.lessons = remoteDataService.lessonData;
    $scope.lessonIndex = scheduleBarSharedService.lessonIndex;

    if(scheduleBarSharedService.lessonIndex == 'all') {
      $scope.currentLesson = {id:'all', title:'All Lessons'};
      $scope.readings = _.flatten(_.pluck(remoteDataService.lessonData,'readings'))
      //$scope.readings = _.reject(allReadings, function(ar){ return typeof ar.id === "undefined"; });
    } else {    
      $scope.currentLesson = _.findWhere(remoteDataService.lessonData, {id: $scope.lessonIndex});
      $scope.readings = $scope.currentLesson.readings
    }

    $scope.$on('handleScheduleBarSelectItem', function() {
      if($scope.lessonIndex != scheduleBarSharedService.lessonIndex) {

          $scope.lessonIndex = scheduleBarSharedService.lessonIndex;

          if($scope.lessonIndex == 'all') {
            $scope.currentLesson = {id:'all', title:'All Lessons'};
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
      //$('.btn').removeClass('button-on');
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
      return scheduleBarSharedService.lessonIndex;
    }

    $scope.getNumberOfNotes = function(id) {
      var found = 0;
      var foundItem = _.findWhere(remoteDataService.userMeta, {id: id});
      if(foundItem !== null && typeof foundItem !== "undefined" &&
        foundItem.notes !== null && typeof foundItem.notes !== "undefined") {
        return foundItem.notes.length;
      } else {
        return 0;
      }
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
          if(readlingListSharedService.filters.flagged || readlingListSharedService.filters.checked) {
            return false;
          } else {
            return 1;  
          }
          
        }
        
      }
    }   

  }
]);


frmControllers.controller('FRMGlossaryCtrl', ['$scope','$timeout','remoteDataService',
  function($scope, $timeout, remoteDataService) {

    $scope.searchTerms = remoteDataService.searchTerms;
    $scope.glossaryData = remoteDataService.glossaryData;

    $timeout(function() {
      pageTransitionIn();
      $('body').removeClass("modal-open")
    }, 0);

 }
]);

frmControllers.controller('FRMReadingsCtrl', ['$scope','$timeout','scheduleBarSharedService','remoteDataService','readlingListSharedService',
  function($scope, $timeout, scheduleBarSharedService, remoteDataService,readlingListSharedService) {
  
    $scope.lessons = remoteDataService.lessonData;
    $scope.lessonIndex = scheduleBarSharedService.lessonIndex;
    if($scope.lessonIndex == 'all') {
      $scope.currentLesson = {id:'all', title:'All Lessons'};
    } else {
      $scope.currentLesson = _.findWhere(remoteDataService.lessonData, {id: $scope.lessonIndex});
    }
    scheduleBarSharedService.allMode = true;

    $timeout(function() {
      pageTransitionIn();
      $('body').removeClass("modal-open")
    }, 0);


    $scope.$on('handleScheduleBarSelectItem', function() {
      if($scope.lessonIndex != scheduleBarSharedService.lessonIndex) {

          $scope.lessonIndex = scheduleBarSharedService.lessonIndex;

          if($scope.lessonIndex == 'all') {
            $scope.currentLesson = {id:'all', title:'All Lessons'};
          } else {  
            var lesson = _.findWhere(remoteDataService.lessonData, {id: $scope.lessonIndex});
            if(lesson !== null && typeof lesson !== "undefined") {          
              $scope.currentLesson = lesson;
            }
          }
      }
    });


    // For Readings
    $scope.selectedReadingArray = [];
    $scope.filterList = function(filterType,value) {
      
      var selector = '.reading-list-area';
      var obj = $(selector)
      if(obj !== null && typeof obj !== "undefined" && obj.length > 0) {
        var spinner = new Spinner(opts).spin(obj[0]);
        $timeout(function() {
        
            readlingListSharedService.filterList(filterType);

            $timeout(function() {
              spinner.stop();
             },400);

        },100);
      }

    }

    $scope.isFilterOn = function(type) {
      return readlingListSharedService.filters[type];
    }

    $scope.loadData = function(selector) {

    }

  }
]);


frmControllers.controller('FRMAppDashCtrl', ['$scope', '$timeout', 'Readings', 'Messages','Lessons','scheduleBarSharedService','remoteDataService','readlingListSharedService',
  function($scope, $timeout, Readings, Messages, Lessons, scheduleBarSharedService, remoteDataService, readlingListSharedService) {
  
  	//$scope.lessons = Lessons.query();
    $scope.lessons = remoteDataService.lessonData;
    $scope.readings = $scope.lessons[0].readings;
    $scope.messages = Messages.query();
    if(scheduleBarSharedService.lessonIndex == 'all') {
      var lesson = _.findWhere(remoteDataService.lessonData, {order: 1});
      scheduleBarSharedService.selectItem(lesson.id);   
    }
  	$scope.lessonIndex = scheduleBarSharedService.lessonIndex;
    $scope.currentLesson = _.findWhere(remoteDataService.lessonData, {id: $scope.lessonIndex});

    scheduleBarSharedService.allMode = false;
    readlingListSharedService.clearFilters();

    //$("#headerRowCol1").hide();

    // Init height;
    var nhRead = window.innerHeight - 240;
    var nhMsg = window.innerHeight - 430;
    $scope.innerWidth = window.innerWidth;
    $scope.innerHeight = window.innerHeight;

    if(window.innerWidth > 995) {

      // set inital scroll area height
      $(".readingscrollregion").css("height", nhRead + "px");
      $(".msgscrollregion").css("height", nhMsg + "px");      

      // show correct dash buttons
      $("#headerRowCol1").hide();
      $("#dashButtons").show();

    } else {

        // turn off scroll
        $(".readingscrollregion").css("height", null);
        $(".msgscrollregion").css("height", null);              

        // show correct dash buttons
        $("#headerRowCol1").show();
        $("#dashButtons").hide();
    }

    $timeout(function() {
      pageTransitionIn();
    }, 0);

    $scope.$on('browserResize', function() {

      $scope.innerWidth = window.innerWidth;
      $scope.innerHeight = window.innerHeight;

      if(window.innerWidth > 995) {

        // set scroll height
        $(".readingscrollregion").css("height", nhRead + "px");
        $(".msgscrollregion").css("height", nhMsg + "px");        

        // alt location for buttons
        $("#headerRowCol1").hide();
        $("#dashButtons").show();

      } else {

        // alt location for buttons
        $("#headerRowCol1").show();
        $("#dashButtons").hide();

        // turn off scroll
        $(".readingscrollregion").css("height", null);
        $(".msgscrollregion").css("height", null);      
      }

    });


    
    $scope.$on('handleScheduleBarSelectItem', function() {
      if($scope.lessonIndex != scheduleBarSharedService.lessonIndex) {
        $scope.lessonIndex = scheduleBarSharedService.lessonIndex;
        var lesson = _.findWhere(remoteDataService.lessonData, {id: $scope.lessonIndex});
        $scope.currentLesson = lesson;
      }
    });

    $scope.go = function() {
      $scope.msgread = 'msgread';
    }

    $scope.gotoFlagged = function() {
      scheduleBarSharedService.selectItem('all');
      readlingListSharedService.filterList('flagged');
      document.location.hash = '#/readings';
    }
    
    // For Messages
    $scope.selectedMessageArray = [];
   
  }
]);

frmControllers.controller('FRMExamSettingsCtrl', ['$scope','$timeout','$location','examSharedService','remoteDataService',
  function($scope,$timeout,$location,examSharedService,remoteDataService) {

    $scope.settings = {
      mode:0,
      topics:0,
      questions:1
    }

    $timeout(function() {
      pageTransitionIn();
    }, 0);

    $scope.isSettingOn = function(type, value) {
      return $scope.settings[type] === value;
    }

    $scope.saveSettings = function() {
      examSharedService.settings = $scope.settings;

      // Complie Questions
      var finalQuestions = [];
      switch($scope.settings.topics)
      {
        case 0:  // Everything I have learned so far
          var readings = _.where(remoteDataService.userMeta, {checked: true});
          var readingsIds = _.pluck(readings, 'id');
          var questions = _.reject(remoteDataService.questionData, function(question) { 
            var inter = _.intersection(readingsIds, question.readings)
            return inter.length == 0; 
          });

          var maxQuestions = $scope.settings.questions;
          if(questions.length < maxQuestions)
            maxQuestions = questions.length;

          for(var i=0; i<maxQuestions; i++) {
            var index = Math.floor(Math.random() * (maxQuestions-i));
            finalQuestions.push(questions[index]);
            questions.splice(index,1);
          }

          examSharedService.questions = finalQuestions;
        break;


        case 1:  // My Trouble Everything Areas
          var readings = _.where(remoteDataService.userMeta, {flagged: true});
          var readingsIds = _.pluck(readings, 'id');
          var questions = _.reject(remoteDataService.questionData, function(question) { 
            var inter = _.intersection(readingsIds, question.readings)
            return inter.length == 0; 
          });

          var maxQuestions = $scope.settings.questions;
          if(questions.length < maxQuestions)
            maxQuestions = questions.length;

          for(var i=0; i<maxQuestions; i++) {
            var index = Math.floor(Math.random() * (maxQuestions-i));
            finalQuestions.push(questions[index]);
            questions.splice(index,1);
          }

          examSharedService.questions = finalQuestions;        
        break;


        case 2:  // By Section

          var readingQuestions = [];
          for(var i=0; i<remoteDataService.lessonData.length; i++) {

            var lesson = remoteDataService.lessonData[i];

            if(lesson !== null && typeof lesson !== "undefined") {

              var readings = lesson.readings;
              var readingsIds = _.pluck(readings, 'id');

              var meta = _.where(remoteDataService.userMeta, {checked: true});
              if(meta !== null || typeof meta !== "undefined" && readingsIds !== null && typeof readingsIds !== "undefined") {
                var metaIds = _.pluck(meta, 'id');
                var inter = _.intersection(readingsIds,metaIds)

                if(inter.length > 0) {

                  for(var j=0; j<lesson.readings.length; j++) {
                    readingQuestions.push(lesson.readings[j]);
                  }

                }
              }
            } 
          }

          var readingsIds = _.pluck(readingQuestions, 'id');
          var questions = _.reject(remoteDataService.questionData, function(question) { 
            var inter = _.intersection(readingsIds, question.readings)
            return inter.length == 0; 
          });

          var maxQuestions = $scope.settings.questions;
          if(questions.length < maxQuestions)
            maxQuestions = questions.length;

          for(var i=0; i<maxQuestions; i++) {
            var index = Math.floor(Math.random() * (maxQuestions-i));
            finalQuestions.push(questions[index]);
            questions.splice(index,1);
          }

          examSharedService.questions = finalQuestions;                  
        break;


        case 3:  // Everything
          var readingQuestions = [];
          for(var i=0; i<remoteDataService.lessonData.length; i++) {

            var lesson = remoteDataService.lessonData[i];

            if(lesson !== null && typeof lesson !== "undefined") {
              for(var j=0; j<lesson.readings.length; j++) {
                readingQuestions.push(lesson.readings[j]);
              }
            } 
          }

          var readingsIds = _.pluck(readingQuestions, 'id');
          var questions = remoteDataService.questionData;
          // _.reject(remoteDataService.questionData, function(question) { 
          //   var inter = _.intersection(readingsIds, question.readings)
          //   return inter.length == 0; 
          // });

          var maxQuestions = $scope.settings.questions;
          if(questions.length < maxQuestions)
            maxQuestions = questions.length;

          for(var i=0; i<maxQuestions; i++) {
            var index = Math.floor(Math.random() * (maxQuestions-i));
            finalQuestions.push(questions[index]);
            questions.splice(index,1);
          }

          examSharedService.questions = finalQuestions;                  
        break;
      }

      $location.path('/exam');
    }


  }
]);


frmControllers.controller('FRMExamDayCtrl', ['$scope','$timeout','$location','examSharedService','remoteDataService',
  function($scope,$timeout,$location,examSharedService,remoteDataService) {

    $('.tab-pane').hide();
    $('#tab1').show();
    $scope.reminderStatus = "";
    $scope.userSession = remoteDataService.userSession;
    $scope.userData = remoteDataService.userData;

    var geocoder;
    var map;
    var mapOptions = {
        zoom: 8
      };

    $timeout(function() {
      pageTransitionIn();
    

      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      geocoder = new google.maps.Geocoder();
      var address = $scope.userData.registeredExam.address + " " + $scope.userData.registeredExam.city + ", " + $scope.userData.registeredExam.state + " " + $scope.userData.registeredExam.zip;
      geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
          });
        } else {
          $('#map-canvas').innerHTML = ' Geocode was not successful for the following reason: ' + status;
        }
      });

    }, 0);

    if(navigator.camera === null || typeof navigator.camera === "undefined") {
      $('.add-reminder-area').hide();
    }
    
    $scope.addReminder=function(type) {

      if(typeof cordova === "undefined" || cordova === null) {

        $scope.reminderStatus = "Failure: cordova not defined";

      } else {

        var startDate = new Date("December 19, 2013 13:00:00");
        var endDate = new Date("December 19, 2013 14:30:00");
        var title = "FRM App Event";
        var location = "Home";
        var notes = "Some notes about this event.";
        var success = function(message) { 
          $scope.reminderStatus = "Success: " + message;
          //$scope.userSession.reminderAdded = true;
          remoteDataService.userSession.reminderAdded = true;
          remoteDataService.commitData();
        };
        var error = function(message) { $scope.reminderStatus = "Failure: " + message };      

        cordova.exec(success, error, "Calendar", "createEvent", [title, location, notes, startDate.getTime(), endDate.getTime()]);
      }
    }

    $scope.tabToItem = function(item) {
      $('.tab-pane').hide();
      $('#examday-tabs li').removeClass('active');
      $('#' + item).show();
      $('#tab_' + item).addClass('active');
    }

  }
]);


frmControllers.controller('FRMExamResultsCtrl', ['$scope','$timeout','$location','examSharedService','remoteDataService',
  function($scope,$timeout,$location,examSharedService,remoteDataService) {

    $scope.userAnswers = examSharedService.userAnswers;
    $scope.correctAnswers = examSharedService.correctAnswers;
    $scope.totalQuestions = examSharedService.questions.length;
    $scope.currentOpen = '';

    $timeout(function() {
      pageTransitionIn();
      $('body').removeClass("modal-open");
    }, 0);


    $scope.showQuestion=function(id) {

      // Close All
      //$('#accordian .panel-collapse').removeClass('collapse.in').addClass('collapse')
      if($scope.currentOpen.length > 0)
        $('#' + $scope.currentOpen).collapse('hide');

      // Open id
      //$('#' + id).removeClass('collapse').addClass('collapse.in');
      $('#' + id).collapse('show');

      $scope.currentOpen = id;
    }

  }
]);


frmControllers.controller('FRMExamCtrl', ['$scope','$timeout','$location','examSharedService','remoteDataService',
  function($scope,$timeout,$location,examSharedService,remoteDataService) {

    $scope.currentQuestion = 0;
    $scope.settings = examSharedService.settings;
    $scope.questions = examSharedService.questions;
    $scope.question = examSharedService.questions[$scope.currentQuestion];
    $scope.totalQuestions = examSharedService.questions.length;
    $scope.answers = $scope.question.answers;
    $scope.choices = $scope.question.choices;
    $scope.answerResponse = "";
    $scope.answerReason = "";

    $scope.correctAnswers = 0;

    $scope.userAnswers = [];

    $timeout(function() {
      pageTransitionIn();
    }, 0);


    $scope.exitExam = function() {
      $('body').removeClass("modal-open");
      document.location.hash = '#/dash';
    }

    $scope.chooseAnswer = function(id) {

      var userAnswer = {};
      userAnswer.question = $scope.question;
      userAnswer.choice = id;

      $scope.userAnswers.push(userAnswer);

      if($scope.question.answer == id) {
        $scope.answerResponse = "Correct!";
        $scope.correctAnswer = "";
        $scope.answerReason = "Keep it up.";
        $scope.correctAnswers++;
      } else {
        $scope.answerResponse = "Sorry, that is not right.";
        $scope.correctAnswer = $scope.question.answer;
        $scope.answerReason = $scope.question.reason;
      }
      if(examSharedService.settings.mode == 0) {
        $("#myModal").modal();
      } else {
        $scope.nextQuestion();
      }
    }


    $('#myModal').on('hidden.bs.modal', function (e) {
      // do something...
      if($scope.currentQuestion == $scope.totalQuestions) {
         //$location.path('/examresults');
         document.location.hash = '#/examresults';
      }
    })


    var gotoQuestion=function() {
      if($scope.currentQuestion == $scope.totalQuestions-1) {

        pageTransitionOut();
        examSharedService.userAnswers = $scope.userAnswers;
        examSharedService.correctAnswers = $scope.correctAnswers;
        $scope.currentQuestion++;
       
      } else {
        $scope.currentQuestion++;
        $scope.question = examSharedService.questions[$scope.currentQuestion];
        $scope.answers = $scope.question.answers;
        $scope.choices = $scope.question.choices;
        $scope.answerResponse = "";
        $scope.answerReason = "";              
      }
    }

    $scope.nextQuestion = function() {

      if(examSharedService.settings.mode == 0) {
        $('#myModal').modal('hide');
          gotoQuestion();
      } else {
        gotoQuestion();
      }

    }

    $scope.flagQuestion = function() {
      
      for(var i=0; i < $scope.question.readings.length; i++) {

        var id = $scope.question.readings[i];
        var type = 'flagged';
        var found = 0;
        var foundItem = _.findWhere(remoteDataService.userMeta, {id: id});
        if(foundItem === null || typeof foundItem === "undefined") {
          var newItem = {id: id};
          newItem[type] = true;
          remoteDataService.userMeta.push(newItem);
        } else {
          foundItem[type]=true;
        }

      }
    }

  }
]);

frmControllers.controller('ExamNavController', ['$scope','examSharedService',
  function($scope,examSharedService) {

    $scope.currentQuestion = 0;
    $scope.totalQuestions = examSharedService.settings.questions;

    $scope.isSettingOn = function(type, value) {
      return $scope.settings[type] === value;
    }


  }
]);

frmControllers.controller('FRMNotesCtrl', ['$scope','scheduleBarSharedService','remoteDataService','readlingListSharedService',
  function($scope,scheduleBarSharedService,remoteDataService,readlingListSharedService) {
    
    $scope.notes = [];
    $scope.currentReading = null;

    $scope.$on('handleSetReadingIndex', function() {

      var li = scheduleBarSharedService.lessonIndex;

      if($scope.lessonIndex == 'all') {

        var allReadings = _.flatten(_.pluck(remoteDataService.lessonData,'readings'))
        var readings = _.reject(allReadings, function(ar){ return typeof ar.id === "undefined"; });        

      } else {

        var foundItem = _.findWhere(remoteDataService.lessonData, {id: scheduleBarSharedService.lessonIndex});
        if(foundItem !== null && typeof foundItem !== "undefined") {
          var readings = foundItem.readings;        
        }

      }

      var found = 0;
      var foundItem = _.findWhere(readings, {id: readlingListSharedService.readingIndex});
      if(foundItem)
        $scope.currentReading = foundItem;
      else $scope.currentReading = null;


      $scope.notes = [];
      var foundItem = _.findWhere(remoteDataService.userMeta, {id: readlingListSharedService.readingIndex});
      if(foundItem !== null && typeof foundItem !== "undefined") {
        if(foundItem.notes !== null && typeof foundItem.notes !== "undefined") {
          $scope.notes = foundItem.notes;
        }
      }

    });

    $scope.addNote = function(note) {
      //$scope.notes.push(note);
      var foundItem = _.findWhere(remoteDataService.userMeta, {id: readlingListSharedService.readingIndex});
      if(foundItem !== null && typeof foundItem !== "undefined") {
        if(foundItem.notes === null || typeof foundItem.notes === "undefined") {
          foundItem.notes=[];
        }
        foundItem.notes.push(note);
        $scope.notes = foundItem.notes;
      }
      remoteDataService.commitData();
      $('#addNote').val('');
    }

    $scope.deleteNote = function(note) {
      var foundItem = _.findWhere(remoteDataService.userMeta, {id: readlingListSharedService.readingIndex});
      if(foundItem !== null && typeof foundItem !== "undefined") {
        var foundNote = _.indexOf(foundItem.Notes, note);        
        if(foundNote !== null && typeof foundNote !== "undefined") {
          foundItem.notes.splice(foundNote,1);
          $scope.notes = foundItem.notes;
          remoteDataService.commitData();
        }
        
      }

    }

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