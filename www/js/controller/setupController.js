'use strict';


angular.module('wuw.controllers')


/*
 * The setup controller.
 * The 'setup' is the process, where the user selects all his courses.
 */
.controller('SetupDetailCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, Setup, Settings, Users) {

    // Called every time the before view gets enteed
    $scope.$on('$ionicView.beforeEnter', function(){
        // If there is no selection object, whe first need it to load on setup page
        if (Setup.selection.length === 0) {
            $ionicHistory.nextViewOptions({ disableBack: true, disableAnimate: true });
            $state.go('setup');
        }
        // Find the currently selected group
        $scope.selection = Setup.selection;
        for (var i = 0; i < Setup.selection.length; i++) {
            if (Setup.selection[i]._id === $stateParams.group) {
                $scope.groupIndex = i;
                $scope.group = Setup.selection[i];
                $scope.lectures = Setup.selection[i].lectures;
            }
        }
    });

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
        if (c === Setup.selection[$scope.groupIndex].lectures.length) {
            Setup.selection[$scope.groupIndex].selectionState = 'checked';
        } else if (c > 0) {
            Setup.selection[$scope.groupIndex].selectionState = 'indeterminate';
        } else {
            Setup.selection[$scope.groupIndex].selectionState = 'none';
        }
        Setup.selection[$scope.groupIndex].lecturesSelectedByUser = c;
    };
})
.controller('SetupCtrl', function($scope, $timeout, $stateParams, $state, $ionicLoading, $ionicHistory, Setup, Settings, Users) {

    // The setup view is shown either via the settings page, or on the app firsts execution.
    // When its showed via settings, we want to display the back button,
    // on the apps first execution we do not need the back button.
    $scope.$on('$ionicView.beforeEnter', function(){
        $scope.showBackButton = $stateParams.showBackButton;
    });

    // Called when a group get checked/unchecked
    $scope.groupCheckboxClicked = function(group) {
        var state = group.selectionState;
        if (state === true) {
            // check all lectures in this group
            group.selectionState = 'checked';
            for (var i = 0; i < group.lectures.length; i++) {
                group.lectures[i].selectedByUser = true;
            }
            group.lecturesSelectedByUser = group.lectures.length;
        } else {
            // uncheck all lectures in this group
            group.selectionState = 'none';
            for (var i = 0; i < group.lectures.length; i++) {
                group.lectures[i].selectedByUser = false;
            }
            group.lecturesSelectedByUser = 0;
        }
    };

    $scope.load = function() {
        $scope.showErrorMessage = false;
        $ionicLoading.show({
            template: '{{"setup.loading" | translate}}'
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

        Settings.setSetting('selectedGroups', JSON.stringify(selectedGroups));
        Settings.setSetting('selectedLectures', JSON.stringify(selectedLectures));
        Settings.setSetting('selectedLecturesLength', selectedLectures.length);
        Users.ping(selectedLectures);

        // Clear the caches.
        Settings.setSetting('localDeadlines', '');
        Settings.setSetting('lecturesCache', '');
        Settings.setSetting('lecturesWeeklyCache', '');

        // Reset Cache Times
        Settings.setSetting('dishesCacheTime', '0');
        Settings.setSetting('lecturesCacheTime', '0');
        Settings.setSetting('lecturesWeeklyCacheTime', '0');
        Settings.setSetting('localDeadlinesCacheTime', '0');

        // Return to home tab
        $ionicHistory.nextViewOptions({ disableBack: true });
        $state.go('tab.home', {location: 'replace'});
    };

    $scope.goBack = function() {
        $ionicHistory.goBack();
    };
});
