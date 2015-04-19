"use strict";

angular.module('wuw.controllers')

.controller('SetupCtrl', function($scope, $timeout, $state, $ionicLoading, Groups, Settings) {
    console.log("setup says hello");

    $ionicLoading.show({
      template: 'Loading available Lectures...'
    });

    Groups.loadAllGroupsWithLectures().then(function(groups) {
        // make this data useable for ngModel
        for (var i = 0; i < groups.length; i++) {
            groups[i].allChosen = false;
            for(var j = 0; j < groups[i].lectures.length; j++) {
                var lectureName = groups[i].lectures[j];
                groups[i].lectures[j] = {};
                groups[i].lectures[j].lectureName = lectureName;
                groups[i].lectures[j].chosen = false;
            }
        }
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
                    selectedLectures.push($scope.groups[i].lectures[j].lectureName);
                }
            }
        }

        Settings.setSetting("selectedGroups", JSON.stringify(selectedGroups));
        Settings.setSetting("selectedLectures", JSON.stringify(selectedLectures));
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
