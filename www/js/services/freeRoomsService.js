/*jshint bitwise: false*/

<<<<<<< HEAD
'use strict';

angular.module('wuw.services')

.factory('FreeRooms', function($http, $q, Settings) {
    var loadFreeRooms = function() {
        var deferred = $q.defer();

        $http.get(Settings.getSetting('apiUrl') + '/rooms/free')
=======
"use strict";

angular.module("wuw.services")

.factory("FreeRooms", function($http, $q, Settings) {
    var loadFreeRooms = function() {
        var deferred = $q.defer();

        $http.get(Settings.getSetting("apiUrl") + "/rooms/free")
>>>>>>> feat-grades
        .success(function(data, status, headers, config) {
            Settings.setSetting('freeRoomsCache', JSON.stringify(data));
            deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    var fromCache = function() {
        var cached = JSON.parse(Settings.getSetting('freeRoomsCache') || '[]');
        return cached;
    };

    return {
        loadFreeRooms: loadFreeRooms,
        fromCache: fromCache
    };
});
