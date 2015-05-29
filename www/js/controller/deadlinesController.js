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
    };

    $scope.deleteDeadlineLocal = function(deadline) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Really delete this deadline?',
            template: ''
        });
        confirmPopup.then(function(res) {
            if(res) {
                Deadlines.remove(deadline);
                setTimeout(function() {
                    $state.go("tab.deadlines", {location: "replace"});
                }, 750);
            }
        });
    };

    $scope.$on('$ionicView.loaded', function(){
        $scope.deadlines = Deadlines.fromCache();
    });

    $scope.$on('$ionicView.afterEnter', function(){
        // If the cache is older then 10 seconds, load new data from API.
        if (Deadlines.secondsSinceCache() > 10) {
            $scope.loading = true;
            $scope.loadDeadlines();
        }
    });
})

.controller('DeadlinesDetailCtrl', function($scope, $stateParams, $ionicPopup, $state, Deadlines) {

    $scope.deadline = Deadlines.get($stateParams.deadlineId);

    $scope.saveDeadline = function() {
        Deadlines.save($scope.deadline);
        setTimeout(function() {
            $state.go("tab.deadlines", {location: "replace"});
        }, 750);
    };

    $scope.deleteDeadline = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Really delete this deadline?',
            template: ''
        });
        confirmPopup.then(function(res) {
            if(res) {
                Deadlines.remove($scope.deadline);
                setTimeout(function() {
                    $state.go("tab.deadlines", {location: "replace"});
                }, 750);
            }
        });
    };
})

.controller('DeadlinesCreateCtrl', function($scope, $state, $ionicPopup, Deadlines, Settings, Lectures) {
    $scope.forms = {};

    $scope.lectureTitles = Lectures.getAllLectureTitles();
    console.log($scope.lectureTitles);

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
            // success
            $scope.savingIcon = '<i class="icon ion-android-cloud-done"></i>';
            $scope.savingText = 'Deadline saved!';
            setTimeout(function() {
                $state.go("tab.deadlines", {location: "replace"});
            }, 750);
        }, function(res){
            // failure
        });
    };
});
