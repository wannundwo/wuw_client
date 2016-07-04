<<<<<<< HEAD
'use strict';
=======
"use strict";
>>>>>>> feat-grades

angular.module('wuw.services')
.service('Setup', ['$window', '$http', '$q', 'Settings', function($window, $http, $q, Settings) {

    this.selection = [];
    var that = this;

    /*
     * Returns all groups its lectures.
     */
    this.loadAllGroupsWithLectures = function() {
        var deferred = $q.defer();
        $http.get(Settings.getSetting('apiUrl') + '/groups/lectures/' +Settings.getSetting('uuid'))
        .success(function(data, status, headers, config) {

            for (var i = 0; i < data.length; i++) {
                var group = data[i];
                if (group.lecturesSelectedByUser == group.lectures.length) {
                    data[i].selectionState = 'checked';
                } else if (data[i].lecturesSelectedByUser > 0) {
                    data[i].selectionState = 'indeterminate';
                } else {
                    data[i].selectionState = 'none';
                }
            }

            that.selection = data;
            deferred.resolve(that.selection);
        })
        .error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };
}]);
