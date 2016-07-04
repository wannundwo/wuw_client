/*jshint bitwise: false*/

<<<<<<< HEAD
'use strict';

angular.module('wuw.services')

.factory('Dishes', function($http, $q, Settings) {
=======
"use strict";

angular.module("wuw.services")

.factory("Dishes", function($http, $q, Settings) {
>>>>>>> feat-grades
    var dishes = JSON.parse(Settings.getSetting('dishesCache') || '[]');
    var numberOfDishes = 18;

    var getDishes = function() {
        var deferred = $q.defer();

<<<<<<< HEAD
        $http.get(Settings.getSetting('apiUrl') + '/dishes')
=======
        $http.get(Settings.getSetting("apiUrl") + "/dishes")
>>>>>>> feat-grades
        .success(function(data, status, headers, config) {
            var filteredDishes = data;

            Settings.setSetting('dishesCache', JSON.stringify(filteredDishes));
            Settings.setSetting('dishesCacheTime', new Date().getTime());
            dishes = filteredDishes;
            deferred.resolve(filteredDishes);
        }).
        error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    var getMoreDishes = function(i) {
        return dishes.slice(0, (numberOfDishes * i) + numberOfDishes);
    };

    var fromCache = function() {
        return dishes;
    };

    var secondsSinceCache = function() {
        var cacheTime = Settings.getSetting('dishesCacheTime');
        if (typeof cacheTime === 'undefined') {
            return Math.pow(2,32) - 1; // highest integer in JS
        }
        var diff = new Date().getTime() - cacheTime;
        return Math.round(diff / 1000);
    };

    return {
        dishes: dishes,
        getDishes: getDishes,
        getMoreDishes: getMoreDishes,
        fromCache: fromCache,
        secondsSinceCache: secondsSinceCache
    };
});
