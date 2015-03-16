"use strict";

angular.module('wuw.controllers')

.controller('HomeCtrl', function($scope, $ionicLoading, Lectures) {

  var reload = function() {
    $scope.loading = true;
    Lectures.all().then(function(lectures){
      console.log("loading done");
      $scope.currLecture = Lectures.getCurrentLecture();
      $scope.nextLecture = Lectures.getNextLecture();
    }).finally(function () {
      $scope.loading = false;
    });
  };

  $scope.$on('$ionicView.beforeEnter', function(){
    $scope.currLecture = Lectures.getCurrentLecture();
    $scope.nextLecture = Lectures.getNextLecture();
    reload();
  });
});
