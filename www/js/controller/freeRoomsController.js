"use strict";

angular.module('wuw.controllers')

.controller('FreeRoomsCtrl', function($scope, FreeRooms) {
    $scope.loadFreeRooms = function() {

        $scope.freeRooms = FreeRooms.fromCache();

        if ($scope.freeRooms.length === 0) {
            $scope.initialLoading = true;
        }

        FreeRooms.loadFreeRooms().then(function(freeRooms){
            $scope.freeRooms = freeRooms;
        }, function(){
        }).finally(function(){
            $scope.initialLoading = false;
            $scope.$broadcast("scroll.refreshComplete");
        });
    };

    $scope.loadFreeRooms();
});
