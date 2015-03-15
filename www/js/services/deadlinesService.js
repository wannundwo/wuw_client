"use strict";

angular.module('wuw.services')

.factory('Deadlines', function($http, $q, Settings) {
    var deadlines = JSON.parse(Settings.getSetting('localDeadlines') || '[]');

    // add a new deadline (to server and locally)
    var add = function(newDeadline) {
        var deferred = $q.defer();
        newDeadline.done = false;
        $http({
            url: Settings.getSetting("apiUrl") + '/deadlines',
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            data: newDeadline
        })
        .then(function(response) {
            deferred.resolve(response);
            newDeadline._id = response.data.id;
            deadlines.push(newDeadline);
            Settings.setSetting('localDeadlines', JSON.stringify(deadlines));
        },
        function(response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };

    // return the deadline to a given id
    var get = function(id) {
        for (var i = 0; i < deadlines.length; i++) {
            if (deadlines[i]._id === id) {
                return deadlines[i];
            }
        }
    };

    // load all deadlines from the server and merge it with the local deadlines.
    var all = function() {
        var deferred = $q.defer();
        var localDeadlines = JSON.parse(Settings.getSetting('localDeadlines') || '[]');
        var mergedDeadlines = [];

        $http.get(Settings.getSetting("apiUrl") + '/deadlines').
        success(function(data, status, headers, config) {

            // iterate over each received deadline and merge it with the local deadlines
            for (var i = 0; i < data.length; i++) {
                var currDeadline = data[i];
                var currLocalDeadline = null;
                var mergedDeadline = null;
                for (var j = 0; j < localDeadlines.length; j++) {
                    currLocalDeadline = localDeadlines[j];
                    if (currLocalDeadline._id === currDeadline._id) {
                        mergedDeadline = {};
                        mergedDeadline._id = currDeadline._id;
                        mergedDeadline.info = currLocalDeadline.info;
                        mergedDeadline.deadline = currDeadline.deadline;
                        mergedDeadline.done = currLocalDeadline.done || false;
                    }
                }

                // if this deadline is not in our local deadlines, it is a new one
                if (!mergedDeadline) {
                    mergedDeadline = currDeadline;
                    mergedDeadline.done = false;
                }
                mergedDeadlines.push(mergedDeadline);
            }
            deadlines = mergedDeadlines;
            Settings.setSetting('localDeadlines', JSON.stringify(mergedDeadlines));
            Settings.setSetting('localDeadlinesCacheTime', new Date().getTime());
            deferred.resolve(mergedDeadlines);
        }).
        error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    // save the changes for a deadline locally
    var save = function(deadline) {
        // search for this deadline and save its changes
        for (var i = 0; i < deadlines.length; i++) {
            if (deadlines[i]._id === deadline._id) {
                deadlines[i].done = deadline.done;
                break;
            }
        }
        Settings.setSetting('localDeadlines', JSON.stringify(deadlines));
    };

    var secondsSinceCache = function() {
      var cacheTime = Settings.getSetting('localDeadlinesCacheTime');
      if (typeof cacheTime === 'undefined') {
        return Math.pow(2,32) - 1; // highest integer in JS
      }
      var diff = new Date().getTime() - cacheTime;
      return Math.round(diff / 1000);
    };

    var fromCache = function() {
        return deadlines;
    };

    return {
        all: all,
        get: get,
        add: add,
        save: save,
        fromCache: fromCache,
        secondsSinceCache: secondsSinceCache
    };
});