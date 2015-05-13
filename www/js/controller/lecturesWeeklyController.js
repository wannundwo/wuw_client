"use strict";

angular.module("wuw.controllers")

.controller("LecturesWeeklyCtrl", function($scope, $ionicHistory, $ionicPopover, $state, $ionicPopup, $compile, $timeout, $filter, Lectures, Settings, uiCalendarConfig) {
    
    $scope.events = [];
    $scope.eventSource = [$scope.events];
    
    $scope.eventAfterRender = function(event, ele, view) {
        ionic.onGesture("tap", function(e) {
            var fci = e.currentTarget._fci;
            $scope.currEvent = $scope.events[fci];
            $scope.popover.show(e);
        }, ele[0], {});
    };
    
    /* config object */
    $scope.uiConfig = {
        calendar: {
            allDaySlot: false,
            disableResizing:true,
            weekends: false, //TODO: look if we have a lecture on saturday, then set it to corresponding value 
            minTime: "08:00:00",
            height: "9000",
            editable: false,
            defaultView: "agendaWeek",
            header: false,
            eventAfterRender: $scope.eventAfterRender
        }
    };
    
    var template =  '<ion-popover-view>' +
                        '<ion-header-bar> '+
                            '<h1 class="title">{{currEvent.title}}</h1>'+
                        '</ion-header-bar> ' + 
                        '<ion-content> '+
                            'Rooms: {{currEvent.rooms | join:","}}'+
                            'Start: {{currEvent.start}}'+
                            'End: {{currEvent.end}}'+
                        '</ion-content> ' + 
                    '</ion-popover-view>';
    $scope.popover = $ionicPopover.fromTemplate(template, {
        scope: $scope
    });
    
    /*
        used to assign events to the full calendar eventSource
    */
    var assignEvents = function(events) {
        $scope.events.length = 0;
        for (var i = 0; i < events.length; i++) {
            $scope.events.push(events[i]);
        }
    };

    $scope.loadLectures = function() {
        Lectures.lecturesThisWeek().then(function(lectures){
            assignEvents(lectures);
            
            //hide an eventually shown error message
            $scope.$broadcast("czErrorMessage.hide"); 
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
        Settings.setSetting("lecturesView", "lecturesList");
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $state.go("tab.lecturesList", {location: "replace"});
    };

    $scope.$on('$ionicView.enter', function(){
        // get the number of selected lectures, if its zero, we display a message to select courses
        $scope.selectedLectures = JSON.parse(Settings.getSetting("selectedLectures") || "[]").length;

        // get lectures from cache, and if the cache is older then 10 seconds load from the API
        assignEvents(Lectures.fromCache("weekly"));
        if (Lectures.secondsSinceCache("weekly") > 10) {
            $scope.loadLectures();
        }
    });
});
