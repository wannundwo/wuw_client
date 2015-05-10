"use strict";

angular.module("wuw.controllers")

.controller("LecturesWeeklyCtrl", function($scope, $ionicHistory, $state, $ionicPopup, $compile, $timeout, $filter, Lectures, Settings, uiCalendarConfig) {
    
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    /* config object */
    $scope.uiConfig = {
        calendar: {
            weekends: false, //TODO: look if we have a lecture on saturday, then set it to corresponding value 
            minTime: "08:00:00",
            height: "9000",
            editable: false,
            defaultView: "agendaWeek",
            header: false,
            dayClick: $scope.alertEventOnClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize
        }
    };
    
    $scope.events = [];
    $scope.eventSource = [$scope.events];

    $scope.loadLectures = function() {
        Lectures.lecturesThisWeek().then(function(lectures){
            
            $scope.events.length = 0;
            for (var i = 0; i < lectures.length; i++) {
                var l = {
                    title: lectures[i].lectureName,
                    start: new Date(lectures[i].startTime),
                    end: new Date(lectures[i].endTime),
                    stick: true,
                    allDay: false   
                };
                $scope.events.push(l);
            }
            
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
    
    $scope.switchToList = function() {
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $state.go("tab.lectures", {location: "replace"});
    };

    $scope.$on('$ionicView.enter', function(){
        // get the number of selected lectures, if its zero, we display a message to select courses
        $scope.selectedLectures = JSON.parse(Settings.getSetting("selectedLectures") || "[]").length;

        // get lectures from cache, and if the cache is older then 10 seconds load from the API
        /*$scope.lectures = Lectures.fromCache();
        if (Lectures.secondsSinceCache() > 10) {
            $scope.loadLectures();
        }*/
    });
});
