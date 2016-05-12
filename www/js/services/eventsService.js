/*jshint bitwise: false*/

'use strict';

angular.module('wuw.services')

.factory('Events', function($http, $q, Settings) {
    var getEvents = function() {
        var deferred = $q.defer();

        $http.get(Settings.getSetting('apiUrl') + '/events')
        .success(function(data, status, headers, config) {
            deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    return {
        getEvents: getEvents
    };
});
