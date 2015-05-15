"use strict";

angular.module('wuw.controllers')

.controller('HomeCtrl', function($scope, $timeout, $ionicLoading, Lectures) {

    // Called every time, the view gets entered.
    // Displays a loading spinner.
    var reload = function() {
        $scope.loading = true;
        Lectures.lecturesForGroups().then(function(lectures){
            $scope.currLecture = Lectures.getCurrentLecture();
            $scope.nextLecture = Lectures.getNextLecture();
        }).finally(function () {
            $scope.loading = false;
        });
    };

    // Called by pull to refresh.
    // Doesnt matter if we got new lectures, update curr and next.
    $scope.doRefresh = function() {
        Lectures.lecturesForGroups().then(function(lectures){}).finally(function () {
            $scope.currLecture = Lectures.getCurrentLecture();
            $scope.nextLecture = Lectures.getNextLecture();
            $scope.$broadcast("scroll.refreshComplete");
        });
    };

    $scope.$on('$ionicView.afterEnter', function(){
        // wrap into $timeout, since getCurrentLecture() & getNextLecture() are blocking
        $timeout(function() {
            reload();
            $scope.currLecture = Lectures.getCurrentLecture();
            $scope.nextLecture = Lectures.getNextLecture();
        }, 10);
    });
});
