"use strict";

angular.module('wuw.services')

.factory('Deadlines', function($http, $q, Settings) {
    var deadlines = JSON.parse(Settings.getSetting('localDeadlines') || '[]');

    /*
     * Sends a new deadline to the server
     */
    var add = function(newDeadline) {
        var deferred = $q.defer();
        newDeadline.done = false;
        newDeadline.group = JSON.parse(newDeadline.group);
        newDeadline.uuid = Settings.getSetting('uuid');
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

    /*
     * Return the deadline to the given id.
     */
    var get = function(id) {
        for (var i = 0; i < deadlines.length; i++) {
            if (deadlines[i]._id === id) {
                return deadlines[i];
            }
        }
    };

    /*
     * Loads the users deadlines from server and merge it with local deadlines,
     * respecting deleted & done status.
     */
    var all = function() {
        var deferred = $q.defer();
        var localDeadlines = JSON.parse(Settings.getSetting('localDeadlines') || '[]');
        var mergedDeadlines = [];

        $http.get(Settings.getSetting("apiUrl") + '/deadlines/user/' + Settings.getSetting('uuid'))
        .success(function(data, status, headers, config) {

            // iterate over each received deadline and merge it with the local deadlines
            for (var i = 0; i < data.length; i++) {
                var currDeadline = data[i];
                var currLocalDeadline = null;
                var mergedDeadline = null;
                for (var j = 0; j < localDeadlines.length; j++) {
                    currLocalDeadline = localDeadlines[j];
                    if (currLocalDeadline._id === currDeadline._id) {
                        mergedDeadline = currDeadline;
                        mergedDeadline.info = currLocalDeadline.info;
                        mergedDeadline.removed = currLocalDeadline.removed || false;
                        mergedDeadline.done = currLocalDeadline.done || false;
                    }
                }

                // if this deadline is not in our local deadlines, it is a new one
                if (!mergedDeadline) {
                    mergedDeadline = currDeadline;
                    mergedDeadline.done = false;
                    mergedDeadline.removed = false;
                }

                // if the deadline is not deleted, add it to our deadlines array
                if (mergedDeadline.done == false) {
                    mergedDeadlines.push(mergedDeadline);
                }
            }
            deadlines = mergedDeadlines;
            Settings.setSetting('localDeadlines', JSON.stringify(mergedDeadlines));
            Settings.setSetting('localDeadlinesCacheTime', new Date().getTime());
            deferred.resolve(mergedDeadlines);
        })
        .error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /*
     * Saves a deadline locally
     */
    var save = function(deadline) {
        for (var i = 0; i < deadlines.length; i++) {
            if (deadlines[i]._id === deadline._id) {
                deadlines[i] = deadline;
                break;
            }
        }
        Settings.setSetting('localDeadlines', JSON.stringify(deadlines));
    };

    /*
     * Return the the age of the cache in seconds
     */
    var secondsSinceCache = function() {
        var cacheTime = Settings.getSetting('localDeadlinesCacheTime');
        if (typeof cacheTime === 'undefined') {
            return Math.pow(2,32) - 1; // highest integer in JS
        }
        var diff = new Date().getTime() - cacheTime;
        return Math.round(diff / 1000);
    };

    /*
     * Get the users deadlines from cache
     */
    var fromCache = function() {
        return JSON.parse(Settings.getSetting('localDeadlines') || '[]');
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
