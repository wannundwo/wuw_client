"use strict";

angular.module('wuw.services')

// super simple service to store the users settings in local storage
// before every key, we add the 'wuw_' prefix
.service('Groups', function($window, $http, $q, Settings) {

    // used in the setup
    var loadAllGroupsWithLectures = function() {
        var deferred = $q.defer();
        $http.get(Settings.getSetting("apiUrl") + "/groupLectures")
        .success(function(data, status, headers, config) {
            deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    return {
        loadAllGroupsWithLectures: loadAllGroupsWithLectures
    };
});
