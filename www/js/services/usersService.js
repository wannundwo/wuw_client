"use strict";

angular.module('wuw.services')

.factory('Users', function($http, $q, Settings) {

    // ping some info to my masters
    var ping = function() {

        var deferred = $q.defer();
        $http({
            url: Settings.getSetting("apiUrl") + '/users',
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            data: {
                deviceId: device.uuid,
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
    };

    return {
        ping: ping,
    };
});
