/*jshint bitwise: false*/

"use strict";

angular.module("wuw.services")

.factory("Lectures", function($http, $q, Settings) {
    var lectures = JSON.parse(Settings.getSetting('lecturesCache') || '[]');
    var lecturesWeekly = JSON.parse(Settings.getSetting('lecturesWeeklyCache') || '[]');
    
    var lecturesThisWeek = function() {
        var deferred = $q.defer();
        var selectedLectures = JSON.parse(Settings.getSetting("selectedLectures") || "[]");

        // if the user hasn't selected courses, reject the request
        if (selectedLectures.length === 0) {
            lectures = [];
            Settings.setSetting('lecturesCache', '[]');
            deferred.reject("noLecturesSelected");
            return deferred.promise;
        }

        $http.post(Settings.getSetting("apiUrl") + "/lectures/weekly", {
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

                if (occursInSelectedLectures) {
                    filteredLectures.push(lecture);
                }
            }

            Settings.setSetting('lecturesWeeklyCache', JSON.stringify(filteredLectures));
            Settings.setSetting('lecturesWeeklyCacheTime', new Date().getTime());
            lecturesWeekly = filteredLectures;
            deferred.resolve(filteredLectures);
        }).
        error(function(data, status, headers, config) {
            deferred.reject("httpFailed");
        });
        return deferred.promise;
    };

    var lecturesForGroups = function() {
        var deferred = $q.defer();
        var selectedLectures = JSON.parse(Settings.getSetting("selectedLectures") || "[]");

        // if the user hasn't selected courses, reject the request
        if (selectedLectures.length === 0) {
            lectures = [];
            Settings.setSetting('lecturesCache', '[]');
            deferred.reject("noLecturesSelected");
            return deferred.promise;
        }

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
            deferred.reject("httpFailed");
        });
        return deferred.promise;
    };

    var fromCache = function(mode) {
        if (mode === "weekly") {
            return lecturesWeekly;
        } 
        return lectures;
    };

    var secondsSinceCache = function(mode) {
        var cacheTime;
        if (mode === "weekly") {
            cacheTime = Settings.getSetting('lecturesWeeklyCacheTime');
        } else {
            cacheTime = Settings.getSetting('lecturesCacheTime');    
        }
        
        if (typeof cacheTime === 'undefined') {
            return Math.pow(2,32) - 1; // highest integer in JS
        }
        
        var diff = new Date().getTime() - cacheTime;
        var seconds = Math.round(diff / 1000);
        return seconds;
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
        lecturesThisWeek: lecturesThisWeek,
        fromCache: fromCache,
        getAllLectureTitles: getAllLectureTitles,
        secondsSinceCache: secondsSinceCache,
        getCurrentLecture: getCurrentLecture,
        getNextLecture: getNextLecture
    };
});
