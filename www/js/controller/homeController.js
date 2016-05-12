'use strict';

angular.module('wuw.controllers')

/*
 * The home controller.
 */
.controller('HomeCtrl', function($scope, $timeout, $ionicLoading, Lectures) {

    /*
     * Loads new lectures from the API, updates current and next lectures.
     */
    var reload = function() {
        $scope.loading = true;
        Lectures.lecturesForUser().then(function(lectures){
            $scope.currLectures = Lectures.getCurrentLecture();
            $scope.nextLectures = Lectures.getNextLecture();
        }).finally(function () {
            $scope.loading = false;
        });
    };

    // Called by pull to refresh.
    // Doesnt matter if we got new lectures, update curr and next.
    $scope.doRefresh = function() {
        Lectures.lecturesForUser().then(function(lectures){}).finally(function () {
            $scope.currLectures = Lectures.getCurrentLecture();
            $scope.nextLectures = Lectures.getNextLecture();
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.$on('$ionicView.afterEnter', function(){
        // wrap into $timeout, since getCurrentLecture() & getNextLecture() are blocking
        $timeout(function() {
            reload();
            $scope.currLectures = Lectures.getCurrentLecture();
            $scope.nextLectures = Lectures.getNextLecture();
        }, 10);
    });
});
