'use strict';

angular.module('wuw.controllers')

/*
 * The navigation controller.
 */
.controller('NavCtrl', function($scope, $ionicSideMenuDelegate, Settings) {
    $scope.showMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    // eventuall redirect user to its preferred lecture view
    $scope.lecturesViewUrl = '#/tab/lecturesList';
    if (Settings.getSetting('lecturesView') === 'lecturesWeekly') {
        $scope.lecturesViewUrl = '#/tab/lecturesWeekly';
    }
});
