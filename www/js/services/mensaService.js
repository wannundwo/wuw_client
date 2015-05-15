/*jshint bitwise: false*/

"use strict";

angular.module("wuw.services")

.factory("Dishes", function($http, $q, Settings) {
    var dishes = JSON.parse(Settings.getSetting('dishesCache') || '[]');

    var getDishes = function() {
        var deferred = $q.defer();

        $http.get(Settings.getSetting("apiUrl") + "/dishes")
        .success(function(data, status, headers, config) {
            var filteredDishes = data;

            Settings.setSetting('dishesCache', JSON.stringify(filteredDishes));
            Settings.setSetting('dishesCacheTime', new Date().getTime());
            dishes = filteredDishes;
            deferred.resolve(filteredDishes.slice(0, 6));
        }).
        error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };
    
    var getMoreDishes = function(i) {
        return dishes.slice(0, (6*i)+6);
    };

    var fromCache = function() {
        return dishes.slice(0, 6);
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
