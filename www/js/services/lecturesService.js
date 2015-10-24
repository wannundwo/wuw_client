/*jshint bitwise: false*/

"use strict";

angular.module("wuw.services")

.factory("Lectures", function($http, $q, Settings) {
    var lectures = JSON.parse(Settings.getSetting('lecturesCache') || '[]');
    // var lecturesWeekly = JSON.parse(Settings.getSetting('lecturesWeeklyCache') || '[]');

    /*
     * Returns the lecture for the current week
     * with extra data for displaying in the calendar with.
     */
    var lecturesThisWeek = function() {
        var deferred = $q.defer();
        var selectedLectures = JSON.parse(Settings.getSetting("selectedLectures") || "[]");

        // if the user hasn't selected courses, reject the request
        if (selectedLectures.length === 0) {
            lectures = [];
            Settings.setSetting('lecturesWeeklyCache', '[]');
            deferred.reject("noLecturesSelected");
            return deferred.promise;
        }

        $http.get(Settings.getSetting("apiUrl") + "/lectures/users/" + Settings.getSetting('uuid'))
        .success(function(data, status, headers, config) {

            // add datefield to every lecutre (useable for grouping)
            for (var i = 0; i < data.length; i++) {
                var d = new Date(data[i].startTime).setHours(0);
                data[i].date = new Date(d).setMinutes(0);
            }

            // add full-calendar specific properties
            var fcPreparedLectures = [];
            for (var j = 0; j < data.length; j++) {
                var l = {
                    fciId: j,
                    title: data[j].lectureName,
                    start: new Date(data[j].startTime),
                    end: new Date(data[j].endTime),
                    rooms: data[j].rooms,
                    docents: data[j].docents,
                    color: data[j].color,
                    stick: true,
                    allDay: false
                };
                fcPreparedLectures.push(l);
            }

            Settings.setSetting('lecturesWeeklyCache', JSON.stringify(fcPreparedLectures));
            Settings.setSetting('lecturesWeeklyCacheTime', new Date().getTime());
            lecturesWeekly = fcPreparedLectures;
            deferred.resolve(fcPreparedLectures);
        }).
        error(function(data, status, headers, config) {
            deferred.reject("httpFailed");
        });
        return deferred.promise;
    };

    /*
     * Return lectures of the current user for the use in the lectures-listview
     */
    var lecturesForUser = function() {
        var deferred = $q.defer();
        var selectedLectures = JSON.parse(Settings.getSetting("selectedLectures") || "[]");

        // if the user hasn't selected courses, reject the request
        if (selectedLectures.length === 0) {
            lectures = [];
            Settings.setSetting('lecturesCache', '[]');
            deferred.reject("noLecturesSelected");
            return deferred.promise;
        }

        $http.get(Settings.getSetting("apiUrl") + "/lectures/users/" + Settings.getSetting('uuid'))
        .success(function(data, status, headers, config) {

            // add datefield to every lecutre (useable for grouping)
            for (var i = 0; i < data.length; i++) {
                var d = new Date(data[i].startTime).setHours(0);
                data[i].date = new Date(d).setMinutes(0);
            }

            Settings.setSetting('lecturesCache', JSON.stringify(data));
            Settings.setSetting('lecturesCacheTime', new Date().getTime());
            lectures = data;
            deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
            deferred.reject("httpFailed");
        });
        return deferred.promise;
    };

    /*
        Returns lectures from cache.
        If mode is "weekly" we provide data for easy use in full calendar.
    */
    var fromCache = function(mode) {
        var cached;
        if (mode === "weekly") {
            cached = JSON.parse(Settings.getSetting('lecturesWeeklyCache') || '[]');
            // convert the date-strings to real JS-Dates
            for (var i = 0; i < cached.length; i++) {
                cached[i].start = new Date(cached[i].start);
                cached[i].end = new Date(cached[i].end);
            }
            return cached;
        }
        cached = JSON.parse(Settings.getSetting('lecturesCache') || '[]');
        return cached;
    };

    /*
        Returns how many seconds has passed since we cached the lectures.
    */
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

    /*
        Returns the title of all lectures in a distinct manner.
    */
    var getAllLectureTitles = function() {
        return JSON.parse(Settings.getSetting("selectedLectures"));
    };

    /*
        Returns the lecture which is currently running.
    */
    var getCurrentLecture = function() {
        var curLectures = [];
        var now = new Date().getTime();
        for (var i = 0; i < lectures.length; i++) {
            var start = new Date(lectures[i].startTime).getTime();
            var end   = new Date(lectures[i].endTime).getTime();
            if (start < now && now < end) {
                curLectures.push(lectures[i]);
            }
        }
        return curLectures;
    };

    /*
        Returns the Users next Lecture.
    */
    var getNextLecture = function() {
        var nextLecture;
        var nextLectures = [];
        var nextLectureDistance = 18446744073709552000;
        var now = new Date().getTime();
        for (var i = 0; i < lectures.length; i++) {
            var lectureDistance = new Date(lectures[i].startTime).getTime() - now;
            if (lectureDistance <= nextLectureDistance && lectureDistance > 0) {
                if (lectureDistance < nextLectureDistance) {
                    nextLectures = [];
                }
                nextLectureDistance = lectureDistance;
                nextLecture = lectures[i];
                nextLectures.push(lectures[i]);
            }
        }
        return nextLectures;
    };


    /*
        Returns how many lectures the user has selected.
    */
    var getSelectedLecturesLength = function() {
        var selectedLecturesLength = Settings.getSetting('selectedLecturesLength');
        if (typeof selectedLecturesLength === "undefined") {
            selectedLecturesLength = JSON.parse(Settings.getSetting("selectedLectures") || "[]").length;
            Settings.setSetting("selectedLecturesLength", selectedLecturesLength);
            return selectedLecturesLength;
        } else {
            return parseInt(selectedLecturesLength);
        }
    };

    return {
        lectures: lectures,
        lecturesForUser: lecturesForUser,
        lecturesThisWeek: lecturesThisWeek,
        fromCache: fromCache,
        getAllLectureTitles: getAllLectureTitles,
        secondsSinceCache: secondsSinceCache,
        getCurrentLecture: getCurrentLecture,
        getNextLecture: getNextLecture,
        getSelectedLecturesLength: getSelectedLecturesLength
    };
});
