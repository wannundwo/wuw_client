"use strict";

angular.module("wuw.controllers")

.controller("LecturesCtrl", function($scope, $state, $ionicHistory, $ionicPopup, $timeout, $filter, Lectures, Settings) {
    
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: "auto",
        editable: false,
        //defaultView: "agendaWeek",
        defaultView: "month",
        header: false,
        dayClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };
    
    $scope.events = [
      {title: 'Long Event', start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
      {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
    ];
    
    $scope.eventSource = [$scope.events];

    $scope.loadLectures = function() {
        Lectures.lecturesForGroups().then(function(lectures){
            $scope.lectures = lectures;
            $scope.$broadcast("czErrorMessage.hide"); //hide an eventually shown error message
        }, function(error) {
            if (error === "httpFailed") {
                // show the error message with some delay to prevent flickering
                $timeout(function() {
                    $scope.$broadcast("czErrorMessage.show");
                }, 300);
            }
        }).finally(function () {
            // remove the refresh spinner a little bit later to prevent flickering
            $timeout(function() {
                $scope.$broadcast("scroll.refreshComplete");
            }, 400);
        });
    };

    $scope.doRefresh = function() {
        $scope.loadLectures();
    };
    
    $scope.switchToCalendar = function() {
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $state.go("tab.lecturesWeekly", {location: "replace"});
    };

    $scope.$on('$ionicView.enter', function(){
        // get the number of selected lectures, if its zero, we display a message to select courses
        $scope.selectedLectures = JSON.parse(Settings.getSetting("selectedLectures") || "[]").length;

        // get lectures from cache, and if the cache is older then 10 seconds load from the API
        $scope.lectures = Lectures.fromCache();
        if (Lectures.secondsSinceCache() > 10) {
            $scope.loadLectures();
        }
    });
})

.controller("LecturesDetailCtrl", function($scope, $stateParams, Lectures) {
    $scope.lecture = Lectures.get($stateParams.lectureId);
});
