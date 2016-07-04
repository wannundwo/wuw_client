<<<<<<< HEAD
'use strict';

angular.module('wuw.controllers')

.controller('LecturesWeeklyCtrl', function($scope, $locale, $ionicHistory, $translate, $ionicPopover, $timeout, $state, $ionicPopup, Lectures, Settings) {
    
    $scope.lectures = [];
    $scope.events = [[],[],[]];

=======
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
>>>>>>> feat-grades
    $ionicPopover.fromTemplateUrl('templates/lecturePopover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

<<<<<<< HEAD

    $scope.onEventClick = function(data){
        // find lecture by event id
        var eventId = data.eventId;
        var clickEvent = data.clickEvent;
        for (var i = 0; i < $scope.lectures.length; i++) {
            var lecture = $scope.lectures[i];
            if (lecture.id == eventId) {
                $scope.clickedLecture = lecture;
                break;
            }
        }
        
        if ($scope.clickedLecture) {
            $scope.popover.show(clickEvent);    
        }
    };

    $scope.closePopover = function() {
        $scope.popover.hide();
    };

    $scope.loadLectures = function() {
        Lectures.lecturesForUser(true).then(function(lectures){
            $scope.lectures = lectures;
            var grouped = groupLecturesForWeek(lectures);
            assignEvents(grouped);
            $scope.$broadcast('czErrorMessage.hide'); //hide an eventually shown error message
        }, function(error) {
            $timeout(function() {
                $scope.$broadcast('czErrorMessage.show');
            }, 300);
        }).finally(function () {
           $scope.$broadcast('scroll.refreshComplete');
        });
    };

    function assignEvents(groupedLectures) {
        var groupedArray = [];
        for (var weekIdentifier in groupedLectures) {
            groupedArray.push(groupedLectures[weekIdentifier]);
        }
        $scope.eventsWeekly = groupedArray;
    }
    
    function groupLecturesForWeek(lectures) {
        var grouped = {};
        
        // check for weekend lectures and build weeks arra
        var hasWeekendLectures = false;
        for (var i = 0; i < lectures.length; i++) {
            var lecture = lectures[i];
            lecture.startTime = moment(lecture.startTime, moment.ISO_8601);
            lecture.endTime = moment(lecture.endTime, moment.ISO_8601);
            lecture.title = lecture.lectureName + '<br>' + lecture.rooms.join(', ');
            
            if (lecture.startTime.isoWeekday() > 5) {
                hasWeekendLectures = true;
            }

            var weekIdentifier = lecture.startTime.format('YYYY_WW');
            if (!grouped[weekIdentifier]) {
                grouped[weekIdentifier] = [];
                var days = 5;
                if (hasWeekendLectures) {
                    days = 7;
                }

                for (var j = 0; j < days; j++) {
                    grouped[weekIdentifier].push([]);
                } 
            }
            var dayNumber = lecture.startTime.isoWeekday()-1; // 0 - 6
            lecture.startTime = lecture.startTime.toDate();
            lecture.endTime = lecture.endTime.utc().toDate();
            grouped[weekIdentifier][dayNumber].push(lecture);
        }
        return grouped;
    }

    /*
     * Navigates to the list view of the lectures and remembers this,
     * so when the user opens the lectures tab again, he will automatically
     * see the last choosen type of view.
     */
    $scope.switchToList = function() {
        Settings.setSetting('lecturesView', 'lecturesList');
=======
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

    $scope.visibles = [true, false, false];
    $scope.slideHasChanged = function($index) {
        $scope.visibles[$index] = true;
    };

    $scope.doRefresh = function() {
        $scope.loadLectures();
    };

    $scope.switchToList = function() {
        Settings.setSetting("lecturesView", "lecturesList");
>>>>>>> feat-grades
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
<<<<<<< HEAD
        $state.go('tab.lecturesList', {location: 'replace'});
    };

     $scope.$on('$ionicView.afterEnter', function(){
        $scope.loadLectures()
        $scope.lectures = Lectures.fromCache(true);
        var grouped = groupLecturesForWeek($scope.lectures);
        assignEvents(grouped);
    });

    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        // eventuall redirect user to its preferred lecture view
        if (Settings.getSetting('lecturesView') === 'lecturesList') {
            $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
            $state.go('tab.lecturesWeekly', {location: 'replace'});      
=======
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

        // If the cache is older then 'cacheLectures' seconds, load new data from API.
        if (Lectures.secondsSinceCache("weekly") > Settings.getSetting('cacheLectures')) {
            $scope.loading = true;
            $scope.loadLectures();
>>>>>>> feat-grades
        }
    });
});
