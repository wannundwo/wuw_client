"use strict";

angular.module('wuw.controllers')

.controller('DeadlinesCtrl', function($scope, $state, $ionicPopup, $timeout, $filter, Deadlines, Settings) {

    $scope.loadDeadlines = function() {
        Deadlines.all().then(function(deadlines){
            $scope.deadlines = deadlines;
            $scope.$broadcast("czErrorMessage.hide"); //hide an eventually shown error message
        }, function() {
            // show the error message with some delay to prevent flickering
            $timeout(function() {
                $scope.$broadcast("czErrorMessage.show");
            }, 300);
        }).finally(function () {
            // remove the refresh spinner a little bit later to prevent flickering
            $timeout(function() {
                $scope.loading = false;
                $scope.$broadcast("scroll.refreshComplete");
            }, 400);
        });
    };

    $scope.doRefresh = function() {
        $scope.loadDeadlines();
    };

    $scope.isNotRemoved = function(deadline) {
      return !deadline.removed;
    };

    $scope.doneToggle = function(deadline) {
        deadline.done = !deadline.done;
        Deadlines.save(deadline);
    };

    $scope.deleteDeadlineLocal = function(deadline) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Really delete this deadline?',
            template: ''
        });
        confirmPopup.then(function(res) {
            if (res) {
                deadline.removed = true;
                Deadlines.save(deadline);
            }
        });
    };

    $scope.toggleInfoVisible = function() {
        if (ionic.Platform.isIOS() && ionic.Platform.isWebView()) {
            navigator.notification.alert(
                $filter('translate')('deadlines.infoTextiOS'),  // message
                null,                                    // callback
                $filter('translate')('deadlines.infoTitle'), // title
                $filter('translate')('global.done')      // buttonName
            );
        } else {
            var alertPopup = $ionicPopup.alert({
                title: $filter('translate')('deadlines.infoTitle'),
                template: $filter('translate')('deadlines.infoText')
            });
        }
    };

    $scope.$on('$ionicView.loaded', function(){
        $scope.deadlines = Deadlines.fromCache();
    });

    $scope.$on('$ionicView.afterEnter', function(){
        // If the cache is older then 'cacheDeadline' seconds, load new data from API.
        if (Deadlines.secondsSinceCache() > Settings.getSetting('cacheDeadline')) {
            $scope.loading = true;
            $scope.loadDeadlines();
        }
    });

    $scope.go = function(state) {
        $state.go(state);
    };
})

.controller('DeadlinesCreateCtrl', function($scope, $state, $ionicPopup, $ionicHistory, Deadlines, Settings, Lectures) {
    $scope.forms = {};

    $scope.savingIcon = '<i class="icon ion-android-done"></i>';
    $scope.savingText = 'Save Deadline';
    $scope.deadline = {};

    $scope.save = function() {
        if ($scope.forms.deadlineForm.$valid === false) {
            $ionicPopup.alert({
                title: 'Error!',
                template: 'Please fill out all fields!'
            });
            return;
        }

        $scope.savingIcon = '<i class="icon spin ion-load-b"></i>';
        $scope.savingText = 'saving...';

        console.log(JSON.stringify($scope.deadline));
        Deadlines.add($scope.deadline).then(function(res){
            // success, change to loading icon to a "save-success" icon
            $scope.savingIcon = '<i class="icon ion-android-cloud-done"></i>';
            $scope.savingText = 'Deadline saved!';

            // after the deadline is saved to the server,
            // go back to deadlines overview without displaying a back button
            setTimeout(function() {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go("tab.deadlines");
            }, 750);
        }, function(res){
            // TODO: handle if the lecture could not be created
        });
    };

    // is executed every time the view gets entered
    $scope.$on('$ionicView.afterEnter', function(){
        $scope.lectureTitles = Lectures.getAllLectureTitles();
    });
})

/*
 * Add this directive to an ion-item to show the options-buttons on a click.
 */
.directive('clickForOptions', ['$ionicGesture', function($ionicGesture) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $ionicGesture.on('tap', function(e){

                // Grab the content
                var content = element[0].querySelector('.item-content');

                // Grab the buttons and their width
                var buttons = element[0].querySelector('.item-options');

                if (!buttons) {
                    console.log('There are no option buttons');
                    return;
                }
                var buttonsWidth = buttons.offsetWidth;

                ionic.requestAnimationFrame(function() {
                    content.style[ionic.CSS.TRANSITION] = 'all ease-out .25s';

                    if (!buttons.classList.contains('invisible')) {
                        console.log('close');
                        content.style[ionic.CSS.TRANSFORM] = '';
                        setTimeout(function() {
                            buttons.classList.add('invisible');
                        }, 250);
                    } else {
                        buttons.classList.remove('invisible');
                        content.style[ionic.CSS.TRANSFORM] = 'translate3d(-' + buttonsWidth + 'px, 0, 0)';
                    }
                });

            }, element);
        }
    };
}])
