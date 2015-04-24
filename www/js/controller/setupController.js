"use strict";

angular.module('wuw.controllers')

.controller('SetupCtrl', function($scope, $timeout, $state, $ionicLoading, Setup, Settings) {

    $ionicLoading.show({
      template: 'Loading available Lectures...'
    });

    Setup.loadAllGroupsWithLectures().then(function(groups) {
        $scope.groups = groups;
    }, function() {
        // TODO: error handling
    }).finally(function() {
        $ionicLoading.hide();
    });

    $scope.saveSetup = function() {
        // receive all groups where something is checked
        // TODO: Some ngModel magic could make this easier.
        var selectedGroups = [];
        var selectedLectures = [];
        for (var i = 0; i < $scope.groups.length; i++) {
            var newGroup = true;
            for (var j = 0; j < $scope.groups[i].lectures.length; j++) {
                if ($scope.groups[i].lectures[j].chosen) {
                    if (newGroup) {
                        selectedGroups.push($scope.groups[i]._id);
                        newGroup = false;
                    }
                    selectedLectures.push({
                        lectureName: $scope.groups[i].lectures[j].lectureName,
                        groupName: $scope.groups[i]._id
                    });
                }
            }
        }

        Settings.setSetting("selectedGroups", JSON.stringify(selectedGroups));
        Settings.setSetting("selectedLectures", JSON.stringify(selectedLectures));
        Settings.setSetting("localDeadlines", "");
        Settings.setSetting("localDeadlines", "");
        $state.go("tab.home", {location: "replace"});
    };

    $scope.onTouch = function($event) {
        var el = angular.element($event.target);
        el.addClass("item-actived-background-transition-active");

        $timeout(function() {
            el.removeClass("item-actived-background-transition-active");
        }, 200);
    };

});
