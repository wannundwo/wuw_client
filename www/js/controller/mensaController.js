"use strict";

angular.module("wuw.controllers")

.controller("MensaCtrl", function($scope, $ionicPopup, $timeout, $filter, Dishes, Settings) {

    var moreCounter = 0;
    $scope.infoVisible = false;

    $scope.loadDishes = function() {
        moreCounter = 0;
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

    $scope.loadMore = function() {
        moreCounter++;
        var moreDishes = Dishes.getMoreDishes(moreCounter);
        $scope.dishes = moreDishes;
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $scope.toggleInfoVisible = function() {
        if (ionic.Platform.isIOS() && ionic.Platform.isWebView()) {
            navigator.notification.alert(
                $filter('translate')('mensa.infoText'),  // message
                null,                                    // callback
                $filter('translate')('mensa.infoTitle'), // title
                $filter('translate')('global.done')      // buttonName
            );
        } else {
            var alertPopup = $ionicPopup.alert({
                title: $filter('translate')('mensa.infoTitle'),
                template: $filter('translate')('mensa.infoText')
            });
        }
    };

    $scope.$on('$ionicView.loaded', function(){
        $scope.dishes = Dishes.fromCache();
    });

    $scope.$on('$ionicView.afterEnter', function(){
        // If the cache is older then 'cacheMensa' seconds, load new data from API.
        if (Dishes.secondsSinceCache() > Settings.getSetting('cacheMensa')) {
            $scope.loadDishes();
        }
    });
})

.controller("MensaDetailCtrl", function($scope, $stateParams, Dishes) {
    $scope.dish = Dishes.get($stateParams.dishId);
});
