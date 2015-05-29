"use strict";

angular.module('wuw.services')

.factory('Users', function($http, $q, Settings) {

    // ping some info to my masters
    var ping = function() {
        if (ionic.Platform.isWebView()) {
            var deferred = $q.defer();
            $http({
                url: Settings.getSetting("apiUrl") + '/users',
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                data: {
                    appVersion: Settings.getSetting('version'),
                    deviceId: Settings.getSetting('uuid'),
                    platform: ionic.Platform.platform(),
                    platformVersion: ionic.Platform.version()
                }
            })
            .then(function(response) {
                deferred.resolve(response);
            },
            function(response) {
                deferred.reject(response);
            });
            return deferred.promise;
        }
    };

    var saveLectureSelection = function(selectedLectures) {
        if (ionic.Platform.isWebView()) {
            var deferred = $q.defer();
            console.log(selectedLectures);
            $http({
                url: Settings.getSetting("apiUrl") + '/users/' + "cfdd47557a0b56b3" + "/lectures",
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                data: {
                    appVersion: Settings.getSetting('version'),
                    deviceId: Settings.getSetting('uuid'),
                    platform: ionic.Platform.platform(),
                    platformVersion: ionic.Platform.version(),
                    selectedLectures: selectedLectures
                }
            })
            .then(function(response) {
                deferred.resolve(response);
            },
            function(response) {
                deferred.reject(response);
            });
            return deferred.promise;
        }
    };

    return {
        ping: ping,
        saveLectureSelection: saveLectureSelection
    };
});
