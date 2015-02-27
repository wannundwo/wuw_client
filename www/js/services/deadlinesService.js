angular.module('wuw.services')

.factory('Deadlines', function($http, $q, Settings) {

    var apiUrl = Settings.getSetting('apiUrl');
    var deadlines = [];

    var add = function(newDeadline) {
        var deferred = $q.defer();
        $http({
            url: Settings.getSetting("apiUrl") + '/deadlines',
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            data: newDeadline
        })
        .then(function(response) {
            deferred.resolve(response);
            newDeadline._id = response.data.id;
            console.log(newDeadline);
            deadlines.push(newDeadline);
        },
        function(response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };

    var get = function(id) {
        for (var i = 0; i < deadlines.length; i++) {
            if (deadlines[i]._id == id) {
                return deadlines[i];
            }
        }
    };

    var all = function() {
        var deferred = $q.defer();
        $http.get(Settings.getSetting("apiUrl") + '/deadlines').
        success(function(data, status, headers, config) {
            deadlines = data;
            deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    return {
        all: all,
        get: get,
        add: add
    }
});
