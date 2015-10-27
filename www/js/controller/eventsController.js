"use strict";

angular.module('wuw.controllers')

.controller('EventsCtrl', function($scope, Events) {
    $scope.loadEvents = function() {
        Events.getEvents().then(function(events){
            $scope.events = events;
        });
    }

    $scope.openEvent = function(url) {
        url = 'http://www.hft-stuttgart.de/' + url;
        window.open(url, '_blank', 'location=yes');
    }

    $scope.loadEvents();
});
