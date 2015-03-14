"use strict";

angular.module("wuw.controllers")

.controller("LecturesCtrl", function($scope, Lectures, Settings) {
    $scope.loadLectures = function() {
        $scope.lectures = [];
        Lectures.all().then(function(lectures){
            $scope.lectures = lectures;
        }).finally(function () {
            $scope.$broadcast("scroll.refreshComplete");
        });
    };

    $scope.doRefresh = function() {
        $scope.loadLectures();
    };

    $scope.isMyCourse = function(lecture) {
      return lecture.group.indexOf(Settings.getSetting('course')) == 0;
    }

    // get lectures from cache, and if the cache is older then 10 seconds load from the API
    $scope.lectures = Lectures.fromCache();
    if (Lectures.secondsSinceCache() > 10) {
      $scope.loadLectures();
    }
})

.controller("LecturesDetailCtrl", function($scope, $stateParams, Lectures) {
    $scope.lecture = Lectures.get($stateParams.lectureId);
});
