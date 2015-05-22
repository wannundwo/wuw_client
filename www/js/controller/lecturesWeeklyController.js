"use strict";

angular.module("wuw.controllers")

.controller("LecturesWeeklyCtrl", function($scope, $locale, $ionicHistory, $translate, $ionicPopover, $state, $ionicPopup, $compile, $timeout, $filter, Lectures, Settings, uiCalendarConfig) {
    
    $scope.events = [];
    $scope.eventSource = [$scope.events];
    var nexted = false;
    
    /*
        After the event was rendered on the calendar, we register an ionic tap-gesture,
        so we get notified when the event was tapped / clicked. Then we can show an ionicPopover
        and display some further information for this event.
        The popovers template is in /templates/lecturePopover.html
    */
    $scope.eventAfterRender = function(event, ele, view) {
        ele.attr("data-fciId", event.fciId);
        ionic.onGesture("tap", function(clickEvent) {
            // find the clicked calendar event
            var fci = parseInt(clickEvent.currentTarget.dataset.fciid);
            $scope.currEvent = $scope.events[fci];
            
            // use the fc-event-time div as popover position
            var target = clickEvent.currentTarget;
            var eventInner = target.childNodes[0];
            var eventTime = eventInner.childNodes[0];
            $scope.popover.show(eventTime);
        }, ele[0], {});
    };
    
    /* 
        This is the configuration object for the calendar.
        The various options are documented here: http://fullcalendar.io/docs/
    */
    $scope.uiConfig = {
        calendar: {
            timeFormat: $locale.DATETIME_FORMATS.shortTime,
            axisFormat: $locale.DATETIME_FORMATS.shortTime,
            columnFormat: "d. MMMM", // this is okay for every language
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
    
    /*
        Create a popover from html template.
    */
    $ionicPopover.fromTemplateUrl('templates/lecturePopover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    
    /*
        Clear the currently clicked event when popover gets hidden.
        This prevents flickering in the popover template.
    */
    $scope.$on('popover.hidden', function() {
        $scope.currEvent = {};
    });
    
    /*
        Because the full-calendar two way binding sucks a little bit,
        we can not simply say $scope.events = lectures;
        Instead we reset the events array and push every lecture seperate.
        This way, full-calendar gets notified about the data source changes.
    */
    var assignEvents = function(lectures) {
        $scope.events.length = 0;
        for (var i = 0; i < lectures.length; i++) {
            $scope.events.push(lectures[i]);
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
                $scope.loading = false;
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
    
    $scope.$on('$ionicView.loaded', function(){
        assignEvents(Lectures.fromCache("weekly"));
    });
    
    $scope.$on('$ionicView.afterEnter', function(){
        if (!nexted) {
            $("#myCalendar2").fullCalendar("next");
            $("#myCalendar3").fullCalendar("next").fullCalendar("next");
            nexted = true;
        }
        
        // If the user hasn't selected any lectures, we give him an message on that.
        $scope.selectedLectures = Lectures.getSelectedLecturesLength();

        // If the cache is older then 10 seconds, load new data from API.
        if (Lectures.secondsSinceCache("weekly") > 10) {
            $scope.loading = true;
            $scope.loadLectures();
        }
    });
});
