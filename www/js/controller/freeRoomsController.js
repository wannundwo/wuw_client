<<<<<<< HEAD
'use strict';
=======
"use strict";
>>>>>>> feat-grades

angular.module('wuw.controllers')

/*
 * The free rooms controller.
 */
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
<<<<<<< HEAD
                if (r !== '1/113') {
=======
                if (r !== "1/113") {
>>>>>>> feat-grades
                    var roomObject = {
                        building: r.split('/')[0],
                        room: r.split('/')[1]
                    };
                    $scope.fRooms.push(roomObject);
                }
            });
        }, function(){
        }).finally(function(){
            $scope.initialLoading = false;
<<<<<<< HEAD
            $scope.$broadcast('scroll.refreshComplete');
=======
            $scope.$broadcast("scroll.refreshComplete");
>>>>>>> feat-grades
        });
    };

    $scope.loadFreeRooms();
});
