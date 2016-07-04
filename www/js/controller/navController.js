<<<<<<< HEAD
'use strict';
=======
"use strict";
>>>>>>> feat-grades

angular.module('wuw.controllers')

/*
 * The navigation controller.
 */
<<<<<<< HEAD
.controller('NavCtrl', function($scope, $ionicSideMenuDelegate, Settings) {
    $scope.showMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    // eventuall redirect user to its preferred lecture view
    $scope.lecturesViewUrl = '#/tab/lecturesList';
    if (Settings.getSetting('lecturesView') === 'lecturesWeekly') {
        $scope.lecturesViewUrl = '#/tab/lecturesWeekly';
    }
=======
.controller('NavCtrl', function($scope, $ionicSideMenuDelegate) {
    $scope.showMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
>>>>>>> feat-grades
});
