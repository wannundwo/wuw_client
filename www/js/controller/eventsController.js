"use strict";

angular.module('wuw.controllers')

.controller('EventsCtrl', function($scope, Events) {
    $scope.loadEvents = function() {
        Events.getEvents().then(function(events){
            $scope.events = events;
        });
    }
    $scope.loadEvents();
});
