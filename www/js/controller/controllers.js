angular.module('wuw.controllers', []) // this is the module definition

.controller('NavCtrl', function($scope, $ionicSideMenuDelegate) {
	$scope.showMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
});
