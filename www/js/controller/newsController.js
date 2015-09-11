"use strict";

angular.module('wuw.controllers')

.controller('NewsCtrl', function($scope, News) {
    $scope.loadNews = function() {
        News.getNews().then(function(news){
            $scope.news = news;
        });
    }

    $scope.openNews = function(url) {
        url = 'http://www.hft-stuttgart.de/' + url;
        window.open(url, '_blank', 'location=yes');
    }

    $scope.loadNews();
});
