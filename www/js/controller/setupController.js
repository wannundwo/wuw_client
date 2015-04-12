"use strict";

angular.module('wuw.controllers')

.controller('SetupCtrl', function($scope, Groups) {
    console.log("setup says hello");
    Groups.loadAllGroupsWithLectures().then(function(groups) {
        $scope.groups = groups;
    }, function() {

    });

    $scope.toggleGroup = function(group) {
        console.log(group);
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };

    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };

});
