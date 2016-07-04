<<<<<<< HEAD
'use strict';
=======
"use strict";
>>>>>>> feat-grades

angular.module('wuw.services')

.factory('Users', function($http, $q, Settings) {

    // ping some info to my masters
    var ping = function(selectedLectures) {
        if (Settings.getSetting('uuid')) {
            var deferred = $q.defer();

            $http({
<<<<<<< HEAD
                url: Settings.getSetting('apiUrl') + '/users/' + Settings.getSetting('uuid') + '/lectures',
                method: 'POST',
=======
                url: Settings.getSetting("apiUrl") + '/users/' + Settings.getSetting('uuid') + "/lectures",
                method: "POST",
>>>>>>> feat-grades
                headers: {'Content-Type': 'application/json'},
                data: {
                    appVersion: Settings.getSetting('version'),
                    deviceId: Settings.getSetting('uuid'),
                    pushToken: Settings.getSetting('pushToken'),
                    platform: ionic.Platform.platform(),
                    platformVersion: ionic.Platform.version(),
                    selectedLectures: Settings.getSetting('selectedLectures')
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
    };
});
