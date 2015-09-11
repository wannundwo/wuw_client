"use strict";

angular.module('wuw.controllers')

.controller('NewsCtrl', function($scope, News) {
    $scope.loadNews = function() {
        News.getNews().then(function(news){
            $scope.news = news;
        });
    }
    $scope.loadNews();
});
