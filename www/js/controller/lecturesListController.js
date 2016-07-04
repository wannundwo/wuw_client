'use strict';
angular.module('wuw.controllers')

/*
 * Lectures list controller.
 */

.controller('LecturesListCtrl', function($scope, $state, $ionicHistory, $ionicPopup, $timeout, $filter, Lectures, Settings) {

    $scope.loadLectures = function() {
        Lectures.lecturesForUser().then(function(lectures){
            $scope.lectures = lectures;
            $scope.$broadcast('czErrorMessage.hide'); //hide an eventually shown error message
        }, function(error) {
            if (error === 'httpFailed') {
                // show the error message with some delay to prevent flickering
                $timeout(function() {
                    $scope.$broadcast('czErrorMessage.show');
                }, 300);
            }
        }).finally(function () {
            // remove the refresh spinner a little bit later to prevent flickering
            $timeout(function() {
                $scope.loading = false;
                $scope.$broadcast('scroll.refreshComplete');
            }, 400);
        });
    };

    $scope.doRefresh = function() {
        $scope.loadLectures();
    };

    /*
     * Navigates to the list view of the lectures and remembers this,
     * so when the user opens the lectures tab again, he will automatically
     * see the last choosen type of view.
     */
    $scope.switchToCalendar = function() {
        Settings.setSetting('lecturesView', 'lecturesWeekly');
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $state.go('tab.lecturesWeekly', {location: 'replace'});
    };

    $scope.$on('$ionicView.loaded', function(){
        $scope.lectures = Lectures.fromCache();
    });

    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        // eventuall redirect user to its preferred lecture view
        if (Settings.getSetting('lecturesView') === 'lecturesWeekly') {
            $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
            $state.go('tab.lecturesWeekly', {location: 'replace'});
        }
    });

    $scope.$on('$ionicView.afterEnter', function(){
        // If the user hasn't selected any lectures, we give him an message on that.
        $scope.selectedLectures = Lectures.getSelectedLecturesLength();

        // If the cache is older then 'cacheLectures' seconds, load new data from API.
        if (Lectures.secondsSinceCache() > Settings.getSetting('cacheLectures')) {
            $scope.loading = true;
            $scope.loadLectures();
        }
    });
})

.controller('LecturesDetailCtrl', function($scope, $stateParams, Lectures) {
    $scope.lecture = Lectures.get($stateParams.lectureId);
});
