'use strict';

angular.module('wuw.controllers')

/*
 * The navigation controller.
 */
.controller('NavCtrl', function($scope, $ionicSideMenuDelegate) {
    $scope.showMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
});
