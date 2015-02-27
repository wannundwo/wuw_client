"use strict";

angular.module("wuw.controllers")

.controller("LecturesCtrl", function($scope, Lectures) {

    $scope.loadLectures = function() {
        Lectures.all().then(function(lectures){
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