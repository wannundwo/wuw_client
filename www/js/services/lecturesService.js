"use strict";

angular.module("wuw.services")

.factory("Lectures", function($http, $q, Settings) {
    var lectures = JSON.parse(Settings.getSetting('lecturesCache') || '[]');

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

            // add datefield to every lecutre (used for grouping)
            data.forEach(function(lecture) {
                var d = new Date(lecture.startTime).setHours(0);
                lecture.date = new Date(d).setMinutes(0);
            });
            Settings.setSetting('lecturesCache', JSON.stringify(data));
            Settings.setSetting('lecturesCacheTime', new Date().getTime());
            lectures = data;
            deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    var fromCache = function() {
      return lectures;
    };

    var secondsSinceCache = function() {
      var cacheTime = Settings.getSetting('lecturesCacheTime');
      if (typeof cacheTime === 'undefined') {
        return Math.pow(2,32) - 1; // highest integer in JS
      }
      var diff = new Date().getTime() - cacheTime;
      return Math.round(diff / 1000);
    };

    return {
        all: all,
        get: get,
        fromCache: fromCache,
        secondsSinceCache: secondsSinceCache
    };
});
