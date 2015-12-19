"use strict";

angular.module('wuw.controllers')

.controller('PrintersCtrl', function($scope, Printers) {
    $scope.loadPrinters = function() {

        $scope.printers = Printers.fromCache();

        if ($scope.printers.length === 0) {
            $scope.initialLoading = true;
        }

        Printers.loadPrinters().then(function(printers){
            $scope.printers = printers;
        }, function(){
        }).finally(function(){
            $scope.initialLoading = false;
            $scope.$broadcast("scroll.refreshComplete");
        });
    };

    $scope.loadPrinters();
});
