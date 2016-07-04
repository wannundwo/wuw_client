'use strict';

angular.module('wuw.controllers')

.controller('LecturesWeeklyCtrl', function($scope, $locale, $ionicHistory, $translate, $ionicPopover, $timeout, $state, $ionicPopup, Lectures, Settings) {

    $scope.lectures = [];
    $scope.events = [[],[],[]];

    $ionicPopover.fromTemplateUrl('templates/lecturePopover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });


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
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });

        $state.go('tab.lecturesList', {location: 'replace'});
    };

     $scope.$on('$ionicView.afterEnter', function(){
        $scope.loadLectures();
        $scope.lectures = Lectures.fromCache(true);
        var grouped = groupLecturesForWeek($scope.lectures);
        assignEvents(grouped);
    });

    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        // eventuall redirect user to its preferred lecture view
        if (Settings.getSetting('lecturesView') === 'lecturesList') {
            $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
            $state.go('tab.lecturesWeekly', {location: 'replace'});
        }
    });
});
