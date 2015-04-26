/*jshint bitwise: false*/

"use strict";

angular.module("wuw.services")

.factory("Lectures", function($http, $q, Settings) {
    var lectures = JSON.parse(Settings.getSetting('lecturesCache') || '[]');

    var lecturesForGroups = function() {
        var deferred = $q.defer();
        var selectedLectures = JSON.parse(Settings.getSetting("selectedLectures") || "[]");

        $http.post(Settings.getSetting("apiUrl") + "/lectures/groups", {
            "groups": Settings.getSetting("selectedGroups")
        }).
        success(function(data, status, headers, config) {
            var filteredLectures = [];

            for (var i = 0; i < data.length; i++) {
                var lecture = data[i];
                var occursInSelectedLectures = false;

                // check if this lectures is in one of the users selected groups
                for (var k = 0; k < selectedLectures.length; k++) {
                    if (lecture.lectureName === selectedLectures[k].lectureName) {
                        occursInSelectedLectures = true;
                    }
                }

                // add datefield to every lecutre (useable for grouping)
                var d = new Date(lecture.startTime).setHours(0);
                lecture.date = new Date(d).setMinutes(0);

                if (occursInSelectedLectures || selectedLectures.length === 0) {
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
        lecturesForGroups: lecturesForGroups,
        fromCache: fromCache,
        getAllLectureTitles: getAllLectureTitles,
        secondsSinceCache: secondsSinceCache,
        getCurrentLecture: getCurrentLecture,
        getNextLecture: getNextLecture
    };
});
