"use strict";

angular.module('wuw.controllers')

.controller('EventsCtrl', function($scope, $filter, Events) {
    $scope.loadEvents = function() {
        if (!$scope.events) {
            $scope.initialLoading = true;
        }

        Events.getEvents().then(function(events){
            for (var i = 0; i < events.length; i++) {
                var event = events[i];

                /*
                    Now follows the handling of the different date/time formats.
                    Of course this logic could be written more efficient
                    by using other condition-statements.
                    For readability resons, we want to stick to the following notation.
                */

                var startDate = new Date(event.startTime);
                var endDate = new Date(event.endTime);
                var exactlySame = startDate.getTime() === endDate.getTime();
                var sameDay = startDate.getFullYear() === endDate.getFullYear() &&
                              startDate.getMonth() === endDate.getMonth() &&
                              startDate.getDate() === endDate.getDate();

                // Case: "21.01.2016 Uhr"
                if (exactlySame && startDate.getHours() === 1) {
                    event.dateString = $filter('date')(startDate, 'dd.MM.yyyy');
                    continue;
                }

                // Case: "21.02.2016 19:00"
                if (exactlySame && startDate.getHours() !== 1) {
                    event.dateString = $filter('date')(startDate, 'dd.MM.yyyy');
                    event.dateString += ', ';
                    event.dateString += $filter('date')(startDate, 'HH:mm');
                    event.dateString += ' Uhr';
                    continue;
                }

                // Case: "21.01.2016 - 25.01.2016
                if (!exactlySame && startDate.getHours() === 1 && endDate.getHours() === 1) {
                    event.dateString = $filter('date')(startDate, 'dd.MM.yyyy');
                    event.dateString += " - ";
                    event.dateString += $filter('date')(endDate, 'dd.MM.yyyy');
                    continue;
                }

                // Case: "19.03.2016, 11:00 - 12:00 Uhr"
                if (sameDay && startDate.getHours() !== 1 && endDate.getHours() !== 1) {
                    event.dateString = $filter('date')(startDate, 'dd.MM.yyyy');
                    event.dateString += ', ';
                    event.dateString += $filter('date')(startDate, 'HH:mm');
                    event.dateString += ' - ';
                    event.dateString += $filter('date')(endDate, 'HH:mm');
                    event.dateString += ' Uhr';
                    continue;
                }

                // Case: "21.01.2016 - 25.01.2016
                //       "11:00 - 12:00 Uhr"
                if (!sameDay && startDate.getHours() !== 1 && endDate.getHours() !== 1) {
                    event.dateString = $filter('date')(startDate, 'dd.MM.yyyy');
                    event.dateString += ' - ';
                    event.dateString += $filter('date')(endDate, 'dd.MM.yyyy');
                    event.dateString += ',<br>';
                    event.dateString += $filter('date')(startDate, 'HH:mm');
                    event.dateString += ' - ';
                    event.dateString += $filter('date')(endDate, 'HH:mm');
                    event.dateString += ' Uhr';
                    continue;
                }
            }
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
