"use strict";

angular.module("wuw.controllers")

.controller("LecturesCtrl", function($scope, Lectures) {

    $scope.loadLectures = function() {
        $scope.lectures = [];
        Lectures.all().then(function(lectures){
            lectures.forEach(function(lecture) {
                lecture.date = new Date(lecture.startTime).getDate() + "." + new Date(lecture.startTime).getMonth()+1 + "." + new Date(lecture.startTime).getFullYear();
            });
            $scope.lectures = lectures;
        }).finally(function () {
            $scope.$broadcast("scroll.refreshComplete");
        });
    };

    $scope.doRefresh = function() {
        $scope.loadLectures();
    };

    // initial loading of lectures
    $scope.loadLectures();
})

.controller("LecturesDetailCtrl", function($scope, $stateParams, Lectures) {
    $scope.lecture = Lectures.get($stateParams.lectureId);
});