"use strict";

angular.module('wuw.services')
.service('Setup', function($window, $http, $q, Settings) {

    // used in the setup
    var loadAllGroupsWithLectures = function() {
        var deferred = $q.defer();
        $http.get(Settings.getSetting("apiUrl") + "/groups/lectures")
        .success(function(data, status, headers, config) {

            // merges the selected groups and lectures into the received data
            var selectedLectures = JSON.parse(Settings.getSetting("selectedLectures") || "[]");

            for (var i = 0; i < data.length; i++) {
                data[i].allChosen = false;
                for (var j = 0; j < data[i].lectures.length; j++) {
                    var lectureName = data[i].lectures[j];
                    data[i].lectures[j] = {};
                    data[i].lectures[j].lectureName = lectureName;

                    // check if the user has this lecture selected
                    for (var k = 0; k < selectedLectures.length; k++) {
                        var selectedLecture = selectedLectures[k];
                        if ((data[i]._id === selectedLecture.groupName) && (data[i].lectures[j].lectureName === selectedLecture.lectureName)) {
                            data[i].lectures[j].chosen = true;
                            break;
                        }
                    }
                }
            }
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
