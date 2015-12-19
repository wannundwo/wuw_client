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
            freeRooms.forEach(function(r) {
                var split = r.split('/');
                var building = split[0];
                //var room = split[1];
                if(r !== "1/113") {
                    $scope.fRooms[building] = ( typeof $scope.fRooms[building] !== 'undefined' && $scope.fRooms[building] instanceof Array ) ? $scope.fRooms[building] : [];
                    $scope.fRooms[building].push(r);
                }
            });
            $scope.freeRooms = freeRooms;
        }, function(){
        }).finally(function(){
            $scope.initialLoading = false;
            $scope.$broadcast("scroll.refreshComplete");
        });
    };

    $scope.loadFreeRooms();
});
