"use strict";

angular.module("wuw.services")

.factory("Lectures", function($http, $q, Settings) {
    var lectures = [];

    var get = function(id) {
        for (var i = 0; i < lectures.length; i++) {
            if (lectures[i]._id == id) {
                return lectures[i];
            }
        }
    };

    var all = function() {
        var deferred = $q.defer();
        $http.get(Settings.getSetting("apiUrl") + "/lectures").
        success(function(data, status, headers, config) {
            lectures = data;
            deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    return {
        all: all,
        get: get
    };
});
