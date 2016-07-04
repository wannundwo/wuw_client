/*jshint bitwise: false*/
'use strict';

angular.module('wuw.services')

.factory('Printers', function($http, $q, Settings) {
    var loadPrinters = function() {
        var deferred = $q.defer();

        $http.get(Settings.getSetting('apiUrl') + '/printers')
        .success(function(data, status, headers, config) {
            Settings.setSetting('printersCache', JSON.stringify(data));
            deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    var fromCache = function() {
        var cached = JSON.parse(Settings.getSetting('printersCache') || '[]');
        return cached;
    };

    return {
        loadPrinters: loadPrinters,
        fromCache: fromCache
    };
});
