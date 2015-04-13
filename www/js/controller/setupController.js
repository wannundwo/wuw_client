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
        if (group.shown) {
            group.shown = false;
        } else {
            group.shown = true;
        }
    };

    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };

});
