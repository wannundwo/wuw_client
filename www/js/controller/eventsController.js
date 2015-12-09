"use strict";

angular.module('wuw.controllers')

.controller('EventsCtrl', function($scope, Events) {
    $scope.loadEvents = function() {
        if (!$scope.events) {
            $scope.initialLoading = true;
        }

        Events.getEvents().then(function(events){
            $scope.events = events;
        }, function(){
        }).finally(function(){
            $scope.initialLoading = false;
            $scope.$broadcast("scroll.refreshComplete");
        });
    };

    $scope.openEvent = function(url) {
        if (url) {
            window.open(url, '_system', 'location=yes');
        }
    };

    $scope.loadEvents();
});
