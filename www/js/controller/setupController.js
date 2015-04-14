"use strict";

angular.module('wuw.controllers')

.controller('SetupCtrl', function($scope, $ionicLoading, Groups) {
    console.log("setup says hello");

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> <br> Loading available Lectures...'
    });
    Groups.loadAllGroupsWithLectures().then(function(groups) {
        $scope.groups = groups;
    }, function() {

    }).finally(function() {
        $ionicLoading.hide();
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

    /*
        lecture: the clicked lecture
        checked: true if the checkbox is checked
        group: the group to which this lecture belongs
    */
    $scope.lectureChecked = function(lecture, checked) {
        console.log(lecture, checked);
    };

    /*
        group: the clicked group
        checked: true if the checkbox is checked
    */
    $scope.groupChecked = function(group, checked) {
        console.log(group, checked);
    };

});
