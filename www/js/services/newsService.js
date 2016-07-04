/*jshint bitwise: false*/

<<<<<<< HEAD
'use strict';

angular.module('wuw.services')

.factory('News', function($http, $q, Settings) {
    var getNews = function() {
        var deferred = $q.defer();

        $http.get(Settings.getSetting('apiUrl') + '/news')
=======
"use strict";

angular.module("wuw.services")

.factory("News", function($http, $q, Settings) {
    var getNews = function() {
        var deferred = $q.defer();

        $http.get(Settings.getSetting("apiUrl") + "/news")
>>>>>>> feat-grades
        .success(function(data, status, headers, config) {
            deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    return {
        getNews: getNews
    };
});
