"use strict";

angular.module('wuw.controllers')

.controller('SetupDetailCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, Setup, Settings, Users) {

    // Called when a lectures get checked/unchecked
    $scope.lectureToggled = function(groupIndex) {
        // Count the current amount of selected lectures
        var c = 0;
        for (var i = 0; i < Setup.selection[$scope.groupIndex].lectures.length; i++) {
            if (Setup.selection[$scope.groupIndex].lectures[i].selectedByUser) {
                c++;
            }
        }

        // Set the selectionState for the group
        if (c == Setup.selection[$scope.groupIndex].lectures.length) {
            Setup.selection[$scope.groupIndex].selectionState = 'checked';
        } else if (c > 0) {
            Setup.selection[$scope.groupIndex].selectionState = 'indeterminate';
        } else {
            Setup.selection[$scope.groupIndex].selectionState = 'none';
        }
        Setup.selection[$scope.groupIndex].lecturesSelectedByUser = c;
    }

    // Called every time the before view gets enteed
    $scope.$on('$ionicView.beforeEnter', function(){

        // Find the currently selected group
        $scope.selection = Setup.selection;
        for (var i = 0; i < Setup.selection.length; i++) {
            if (Setup.selection[i]._id === $stateParams.group) {
                $scope.groupIndex = i;
                $scope.lectures = Setup.selection[i].lectures;
            }
        }
    });
})
.controller('SetupCtrl', function($scope, $timeout, $state, $ionicLoading, $ionicHistory, Setup, Settings, Users) {

    // Called when a group get checked/unchecked
    $scope.groupCheckboxClicked = function(index) {
        var state = Setup.selection[index].selectionState;
        if (state === true) {
            Setup.selection[index].selectionState = 'checked';
            // check all lectures in this group
            for (var i = 0; i < Setup.selection[index].lectures.length; i++) {
                Setup.selection[index].lectures[i].selectedByUser = true;
            }
            Setup.selection[index].lecturesSelectedByUser = Setup.selection[index].lectures.length;
        } else {
            Setup.selection[index].selectionState = 'none';
            // uncheck all lectures in this group
            for (var i = 0; i < Setup.selection[index].lectures.length; i++) {
                Setup.selection[index].lectures[i].selectedByUser = false;
            }
            Setup.selection[index].lecturesSelectedByUser = 0;
        }
    }

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
    $scope.load();

    // Save the users lecture selection to server & locally
    $scope.saveSetup = function() {
        // receive all chosen groups and lectures

        var selectedGroups = [];
        var selectedLectures = [];

        // search seletec groups
        for (var i = 0; i < Setup.selection.length; i++) {
            var group = Setup.selection[i];
            if (group.lecturesSelectedByUser > 0) {
                selectedGroups.push(group._id);
                // search selected lectures in this group
                for (var j = 0; j < group.lectures.length; j++) {
                    if (group.lectures[j].selectedByUser) {
                        selectedLectures.push({
                            lectureName: group.lectures[j].lectureName,
                            groupName: group._id
                        });
                    }
                }
            }
        }

        Settings.setSetting("selectedGroups", JSON.stringify(selectedGroups));
        Settings.setSetting("selectedLectures", JSON.stringify(selectedLectures));
        Settings.setSetting("selectedLecturesLength", selectedLectures.length);
        Users.ping(selectedLectures);

        // Clear the caches.
        Settings.setSetting("localDeadlines", "");
        Settings.setSetting("lecturesCache", "");
        Settings.setSetting("lecturesWeeklyCache", "");

        // Reset Cache Times
        Settings.setSetting("dishesCacheTime", "0");
        Settings.setSetting("lecturesCacheTime", "0");
        Settings.setSetting("lecturesWeeklyCacheTime", "0");
        Settings.setSetting("localDeadlinesCacheTime", "0");

        // Return to home tab
        $ionicHistory.nextViewOptions({ disableBack: true });
        $state.go("tab.home", {location: "replace"});
    };
});
