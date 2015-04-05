"use strict";

angular.module("wuw.controllers")

.controller("LecturesCtrl", function($scope, $ionicPopup, $filter, Lectures, Settings) {

    $scope.loadLectures = function() {
        Lectures.upcoming().then(function(lectures){
            $scope.lectures = lectures;
        }, function() {
            // TODO: Display some nice, non-blocking, error message.
            $ionicPopup.alert({
                title: $filter('translate')('global.error'),
                template: $filter('translate')('lectures.cantload'),
            });
        }).finally(function () {
            $scope.$broadcast("scroll.refreshComplete");
        });
    };

    $scope.doRefresh = function() {
        $scope.loadLectures();
    };

    $scope.isMyCourse = function(lecture) {
        // TODO: improve this
        // actually, we doesn't need this anymore, hurray!
        return lecture.groups.join().indexOf(Settings.getSetting('course')) === 0;
    };

    $scope.isUpcoming = function(lecture) {
        if (Date.parse(lecture.endTime) >= Date.now()) {
            return true;
        }
        return false;
    };

    $scope.$on('$ionicView.enter', function(){
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
