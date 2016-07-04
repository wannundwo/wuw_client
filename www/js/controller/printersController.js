<<<<<<< HEAD
'use strict';
=======
"use strict";
>>>>>>> feat-grades

angular.module('wuw.controllers')

/*
 * The printers controllers.
 */
.controller('PrintersCtrl', function($scope, Printers) {
    $scope.loadPrinters = function() {

        $scope.printers = Printers.fromCache();

        if ($scope.printers.length === 0) {
            $scope.initialLoading = true;
        }

        Printers.loadPrinters().then(function(printers){
            $scope.printers = printers;
        }, function() {
            // error handling
        }).finally(function(){
            $scope.initialLoading = false;
<<<<<<< HEAD
            $scope.$broadcast('scroll.refreshComplete');
=======
            $scope.$broadcast("scroll.refreshComplete");
>>>>>>> feat-grades
        });
    };

    $scope.loadPrinters();
});
