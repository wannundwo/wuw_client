"use strict";

angular.module('wuw.controllers')

.controller('SetupCtrl', function($scope, $timeout, $state, $ionicLoading, Setup, Settings) {

    $scope.load = function() {
        $scope.showErrorMessage = false;
        $ionicLoading.show({
            template: "{{'setup.loading' | translate}}"
        });

        Setup.loadAllGroupsWithLectures().then(function(groups) {
            $scope.groups = groups;
        }, function() {
            $scope.showErrorMessage = true;
        }).finally(function() {
            $ionicLoading.hide();
        });
    };

    $scope.saveSetup = function() {
        // receive all chosen groups and lectures
        try {
            var selectedGroups = [];
            var selectedLectures = [];
            for (var i = 0; i < $scope.groups.length; i++) {
                var newGroup = true;
                for (var j = 0; j < $scope.groups[i].lectures.length; j++) {
                    if ($scope.groups[i].lectures[j].chosen) {
                        if (newGroup) { // make sure a group is added only once
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
            Settings.setSetting("selectedLecturesLength", selectedLectures.length);
            
            // Clear the caches.
            Settings.setSetting("localDeadlines", "");
            Settings.setSetting("lecturesCache", "");
            Settings.setSetting("lecturesWeeklyCache", "");
            
            // Reset Cache Times
            Settings.setSetting("dishesCacheTime", "0");
            Settings.setSetting("lecturesCacheTime", "0");
            Settings.setSetting("lecturesWeeklyCacheTime", "0");
            Settings.setSetting("localDeadlinesCacheTime", "0");
        }
        catch(e) { }
        finally {
            // TODO: if user came from lectures, take him back to lectures.
            $state.go("tab.home", {location: "replace"});
        }
    };
    
    $scope.$on('$ionicView.afterEnter', function(){
        $scope.load();
    });
});
