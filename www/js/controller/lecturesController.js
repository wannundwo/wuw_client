"use strict";

angular.module("wuw.controllers")

.controller("LecturesCtrl", function($scope, $ionicPopup, $timeout, $filter, Lectures, Settings) {

    $scope.loadLectures = function() {
        Lectures.lecturesForGroups().then(function(lectures){
            $scope.lectures = lectures;
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

    $scope.$on('$ionicView.enter', function(){
        // get the number of selected lectures, if its zero, we display a message to select courses
        $scope.selectedLectures = JSON.parse(Settings.getSetting("selectedLectures") || "[]").length;

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
