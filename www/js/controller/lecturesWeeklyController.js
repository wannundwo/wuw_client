'use strict';

angular.module('wuw.controllers')

.controller('LecturesWeeklyCtrl', function($scope, $locale, $ionicHistory, $translate, $ionicPopover, $state, $ionicPopup, Lectures, Settings) {
    
    $scope.events = [[],[],[]];

    $scope.onEventClick = function(eventId){
        console.log("lecturesWeeklyCtrl", eventId);
    };

    $scope.loadLectures = function() {
        Lectures.lecturesForUser().then(function(lectures){
            $scope.lectures = lectures;
            $scope.$broadcast('czErrorMessage.hide'); //hide an eventually shown error message
        }, function(error) {
            if (error === 'httpFailed') {
                // show the error message with some delay to prevent flickering
                $timeout(function() {
                    $scope.$broadcast('czErrorMessage.show');
                }, 300);
            }
        }).finally(function () {
           $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.doRefresh = function() {
        $scope.loadLectures();
    };

    $scope.$on('$ionicView.afterEnter', function(){
        var cachedLectures = Lectures.fromCache();
        var grouped = groupLecturesForWeek(cachedLectures);
        assignEvents(grouped);
    });

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
            lecture.title = lecture.lectureName;
            
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

    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        if (Settings.getSetting('lecturesView') === 'lecturesList') {
            $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
            $state.go('tab.lecturesWeekly', {location: 'replace'});      
        }
    });
});
