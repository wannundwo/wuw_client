'use strict';

angular.module('wuw.controllers')

/*
 * The news controller
 */
.controller('NewsCtrl', function($scope, News) {
    $scope.loadNews = function() {
        if (!$scope.news) {
            $scope.initialLoading = true;
        }

        News.getNews().then(function(news){
            $scope.news = news;
        }, function(){
        }).finally(function(){
            $scope.initialLoading = false;
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.openNews = function(url) {
        url = 'http://www.hft-stuttgart.de/' + url;
        window.open(url, '_system', 'location=yes');
    };

    $scope.loadNews();
});
