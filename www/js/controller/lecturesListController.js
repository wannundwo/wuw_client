"use strict";

angular.module("wuw.controllers")

.controller("LecturesListCtrl", function($scope, $state, $ionicHistory, $ionicPopup, $timeout, $filter, Lectures, Settings) {

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
                $scope.loading = false;
                $scope.$broadcast("scroll.refreshComplete");
            }, 400);
        });
    };

    $scope.doRefresh = function() {
        $scope.loadLectures();
    };
    
    $scope.switchToCalendar = function() {
        Settings.setSetting("lecturesView", "lecturesWeekly");
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $state.go("tab.lecturesWeekly", {location: "replace"});
    };
    
    $scope.$on('$ionicView.loaded', function(){
        $scope.lectures = Lectures.fromCache();
    });
    
    $scope.$on('$ionicView.afterEnter', function(){
        // If the user hasn't selected any lectures, we give him an message on that.
        $scope.selectedLectures = Lectures.getSelectedLecturesLength();
        
        // If the cache is older then 10 seconds, load new data from API.
        if (Lectures.secondsSinceCache() > 10) {
            $scope.loading = true;
            $scope.loadLectures();
        }
    });
})

.controller("LecturesDetailCtrl", function($scope, $stateParams, Lectures) {
    $scope.lecture = Lectures.get($stateParams.lectureId);
});
