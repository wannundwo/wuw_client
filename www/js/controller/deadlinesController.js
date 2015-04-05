"use strict";

angular.module('wuw.controllers')

.controller('DeadlinesCtrl', function($scope, $ionicPopup, $filter, Deadlines, Settings) {

    $scope.loadDeadlines = function() {
        Deadlines.all().then(function(deadlines){
            $scope.deadlines = deadlines;
        }, function() {
            // TODO: Display some nice, non-blocking, error message.
            $ionicPopup.alert({
                title: $filter('translate')('global.error'),
                template: $filter('translate')('deadlines.cantload'),
            });
        }).finally(function () {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.doRefresh = function() {
        $scope.loadDeadlines();
    };

    $scope.isNotRemoved = function(deadline) {
      return !deadline.removed;
    };

    $scope.$on('$ionicView.enter', function(){
      // get deadlines from cache, and if the cache is older then 10 seconds load from the API
      $scope.deadlines = Deadlines.fromCache();
      if (Deadlines.secondsSinceCache() > 10) {
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
