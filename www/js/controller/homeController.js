angular.module('wuw.controllers')

.controller('HomeCtrl', function($scope, Lectures) {
  $scope.currLecture = Lectures.getCurrentLecture();
  $scope.nextLecture = Lectures.getNextLecture();
})
