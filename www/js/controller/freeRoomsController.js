"use strict";

angular.module('wuw.controllers')

.controller('FreeRoomsCtrl', function($scope, FreeRooms) {
    $scope.loadFreeRooms = function() {

        $scope.freeRooms = FreeRooms.fromCache();

        if ($scope.freeRooms.length === 0) {
            $scope.initialLoading = true;
        }

        $scope.fRooms = [];
        FreeRooms.loadFreeRooms().then(function(freeRooms){

            // group the rooms by their building
            freeRooms.forEach(function(r) {
                var building = r.split('/')[0];

                // exclude room 1/113
                if (r !== "1/113") {
                    // if there isn't already an array for rooms of this building, create it
                    if (typeof $scope.fRooms[building] === 'undefined') {
                        $scope.fRooms[building] = [];
                    }
                    // add the room to this buildings array
                    $scope.fRooms[building].push(r);
                }
            });
            console.log($scope.fRooms);
        }, function(){
        }).finally(function(){
            $scope.initialLoading = false;
            $scope.$broadcast("scroll.refreshComplete");
        });
    };

    $scope.loadFreeRooms();
});
