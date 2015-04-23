/*jshint bitwise: false*/

"use strict";

angular.module("wuw.services")

.factory("Lectures", function($http, $q, Settings) {
    var lectures = JSON.parse(Settings.getSetting('lecturesCache') || '[]');

    var get = function(id) {
        for (var i = 0; i < lectures.length; i++) {
            if (lectures[i]._id === id) {
                return lectures[i];
            }
        }
    };

    var all = function() {
        var deferred = $q.defer();
        $http.get(Settings.getSetting("apiUrl") + "/lectures")
        .success(function(data, status, headers, config) {

            for (var i = 0; i < data.length; i++) {
                var lecture = data[i];

                // add datefield to every lecutre (used for grouping)
                var d = new Date(lecture.startTime).setHours(0);
                lecture.date = new Date(d).setMinutes(0);
            }

            Settings.setSetting('lecturesCache', JSON.stringify(data));
            Settings.setSetting('lecturesCacheTime', new Date().getTime());
            lectures = data;
            deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    var upcoming = function() {
        var deferred = $q.defer();
        $http.get(Settings.getSetting("apiUrl") + "/upcomingLectures").
        success(function(data, status, headers, config) {

            // add datefield to every lecutre (used for grouping)
            data.forEach(function(lecture) {
                var d = new Date(lecture.startTime).setHours(0);
                lecture.date = new Date(d).setMinutes(0);
            });
            Settings.setSetting('lecturesCache', JSON.stringify(data));
            Settings.setSetting('lecturesCacheTime', new Date().getTime());
            lectures = data;
            deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    var lecturesForGroups = function() {
        var deferred = $q.defer();
        var selectedLectures = JSON.parse(Settings.getSetting("selectedLectures") || "[]");

        $http.post(Settings.getSetting("apiUrl") + "/LecturesForGroups", {
            "groups": Settings.getSetting("selectedGroups")
        }).
        success(function(data, status, headers, config) {
            var filteredLectures = [];

            for (var i = 0; i < data.length; i++) {
                var lecture = data[i];
                var occursInSelectedLectures = false;
                console.log(lecture.groups);

                // check if this lectures is in one of the users selected groups
                for (var k = 0; k < selectedLectures.length; k++) {
                    if (lecture.lectureName === selectedLectures[k]) {
                        occursInSelectedLectures = true;
                    }
                }

                // add datefield to every lecutre (useable for grouping)
                var d = new Date(lecture.startTime).setHours(0);
                lecture.date = new Date(d).setMinutes(0);

                if (occursInSelectedLectures) {
                    filteredLectures.push(lecture);
                }
            }

            Settings.setSetting('lecturesCache', JSON.stringify(filteredLectures));
            Settings.setSetting('lecturesCacheTime', new Date().getTime());
            lectures = filteredLectures;
            deferred.resolve(filteredLectures);
        }).
        error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    var fromCache = function() {
        return lectures;
    };

    var secondsSinceCache = function() {
        var cacheTime = Settings.getSetting('lecturesCacheTime');
        if (typeof cacheTime === 'undefined') {
            return Math.pow(2,32) - 1; // highest integer in JS
        }
        var diff = new Date().getTime() - cacheTime;
        return Math.round(diff / 1000);
    };

    var getAllLectureTitles = function() {
        var lectureTitles = [];
        for (var i = 0; i < lectures.length; i++) {
            var lectureTitle = lectures[i].lectureName;

            // check if the lectureTitle is new
            if (lectureTitles.indexOf(lectureTitle) < 0) {
                lectureTitles.push(lectureTitle);
            }
        }
        return lectureTitles;
    };

    var getCurrentLecture = function() {
        var now = new Date().getTime();
        for (var i = 0; i < lectures.length; i++) {
            var start = new Date(lectures[i].startTime).getTime();
            var end   = new Date(lectures[i].endTime).getTime();
            if (start < now && now < end) {
                return lectures[i];
            }
        }
    };

    var getNextLecture = function() {
        var nextLecture;
        var nextLectureDistance = 18446744073709552000;
        for (var i = 0; i < lectures.length; i++) {
            var lectureDistance = new Date(lectures[i].startTime).getTime() - new Date().getTime();
            if (lectureDistance < nextLectureDistance && lectureDistance > 0) {
                nextLectureDistance = lectureDistance;
                nextLecture = lectures[i];
            }
        }
        return nextLecture;
    };

    return {
        lectures: lectures,
        all: all,
        upcoming: upcoming,
        lecturesForGroups: lecturesForGroups,
        get: get,
        fromCache: fromCache,
        getAllLectureTitles: getAllLectureTitles,
        secondsSinceCache: secondsSinceCache,
        getCurrentLecture: getCurrentLecture,
        getNextLecture: getNextLecture
    };
});
