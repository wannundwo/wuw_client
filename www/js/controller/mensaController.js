"use strict";

angular.module("wuw.controllers")

.controller("MensaCtrl", function($scope, $ionicPopup, $timeout, $filter, Dishes, Settings) {

    $scope.loadDishes = function() {
        Dishes.getDishes().then(function(dishes){
            $scope.dishes = dishes;
            $scope.$broadcast("czErrorMessage.hide"); //hide an eventually shown error message
        }, function() {
            // show the error message with some delay to prevent flickering
            $timeout(function() {
                $scope.$broadcast("czErrorMessage.show");
            }, 300);
        }).finally(function () {
            // remove the refresh spinner a little bit later to prevent flickering
            $timeout(function() {
                $scope.$broadcast("scroll.refreshComplete");
            }, 400);
        });
    };

    $scope.doRefresh = function() {
        $scope.loadDishes();
    };

    $scope.$on('$ionicView.enter', function(){
        // get dishes from cache, and if the cache is older then 10 seconds load from the API
        $scope.dishes = Dishes.fromCache();
        if (Dishes.secondsSinceCache() > 10) {
            $scope.loadDishes();
        }
    });
})

.controller("MensaDetailCtrl", function($scope, $stateParams, Dishes) {
    $scope.dish = Dishes.get($stateParams.dishId);
});