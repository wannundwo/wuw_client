/*jshint bitwise: false*/

<<<<<<< HEAD
'use strict';

angular.module('wuw.services')

.factory('Lectures', function($http, $q, Settings) {
=======
"use strict";

angular.module("wuw.services")

.factory("Lectures", function($http, $q, Settings) {
>>>>>>> feat-grades
    var lectures = JSON.parse(Settings.getSetting('lecturesCache') || '[]');
    // var lecturesWeekly = JSON.parse(Settings.getSetting('lecturesWeeklyCache') || '[]');

    /*
<<<<<<< HEAD
     * Return lectures of the current user for the use in the lectures-listview
     */
    var lecturesForUser = function(weekly) {
        var deferred = $q.defer();
        var selectedLectures = JSON.parse(Settings.getSetting('selectedLectures') || '[]');
=======
     * Returns the lecture for the current week
     * with extra data for displaying in the calendar with.
     */
    var lecturesThisWeek = function() {
        var deferred = $q.defer();
        var selectedLectures = JSON.parse(Settings.getSetting("selectedLectures") || "[]");
>>>>>>> feat-grades

        // if the user hasn't selected courses, reject the request
        if (selectedLectures.length === 0) {
            lectures = [];
<<<<<<< HEAD
            Settings.setSetting('lecturesCache', '[]');
            deferred.reject('noLecturesSelected');
            return deferred.promise;
        }

        $http.get(Settings.getSetting('apiUrl') + '/lectures/users/' + Settings.getSetting('uuid') + "/?weekly=" + weekly)
=======
            Settings.setSetting('lecturesWeeklyCache', '[]');
            deferred.reject("noLecturesSelected");
            return deferred.promise;
        }

        $http.get(Settings.getSetting("apiUrl") + "/lectures/users/" + Settings.getSetting('uuid'))
>>>>>>> feat-grades
        .success(function(data, status, headers, config) {

            // add datefield to every lecutre (useable for grouping)
            for (var i = 0; i < data.length; i++) {
                var d = new Date(data[i].startTime).setHours(0);
                data[i].date = new Date(d).setMinutes(0);
            }

<<<<<<< HEAD
            if (weekly) {
                Settings.setSetting('lecturesWeeklyCache', JSON.stringify(data));
                Settings.setSetting('lecturesWeeklyCacheTime', new Date().getTime());    
            } else {
                Settings.setSetting('lecturesCache', JSON.stringify(data));
                Settings.setSetting('lecturesCacheTime', new Date().getTime());    
            }

=======
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
>>>>>>> feat-grades
            lectures = data;
            deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
<<<<<<< HEAD
            deferred.reject('httpFailed');
=======
            deferred.reject("httpFailed");
>>>>>>> feat-grades
        });
        return deferred.promise;
    };

    /*
     * Returns lectures from cache.
<<<<<<< HEAD
     * If weekly is true we provide data for easy use in calendar.
    */
    var fromCache = function(weekly) {
        var cached;
        if (weekly) {
=======
     * If mode is "weekly" we provide data for easy use in full calendar.
    */
    var fromCache = function(mode) {
        var cached;
        if (mode === "weekly") {
>>>>>>> feat-grades
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
     *Returns how many seconds has passed since we cached the lectures.
     */
<<<<<<< HEAD
    var secondsSinceCache = function(weekly) {
        var cacheTime;
        if (weekly) {
=======
    var secondsSinceCache = function(mode) {
        var cacheTime;
        if (mode === "weekly") {
>>>>>>> feat-grades
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
     * Returns the title of all lectures in a distinct manner.
     */
    var getAllLectureTitles = function() {
<<<<<<< HEAD
        return JSON.parse(Settings.getSetting('selectedLectures'));
=======
        return JSON.parse(Settings.getSetting("selectedLectures"));
>>>>>>> feat-grades
    };

    /*
     * Returns the lecture which is currently running.
     * We use this to select a lecture when creating a deadline
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
     * Returns the users next lectures in an array.
     */
    var getNextLecture = function() {
        var nextLecture;
        var nextLectures = [];
<<<<<<< HEAD
        var nextLectureDistance = Number.MAX_SAFE_INTEGER;
=======
        var nextLectureDistance = 18446744073709552000;
>>>>>>> feat-grades
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
     * Returns how many lectures the user has selected.
     */
    var getSelectedLecturesLength = function() {
        var selectedLecturesLength = Settings.getSetting('selectedLecturesLength');
<<<<<<< HEAD
        if (typeof selectedLecturesLength === 'undefined') {
            selectedLecturesLength = JSON.parse(Settings.getSetting('selectedLectures') || '[]').length;
            Settings.setSetting('selectedLecturesLength', selectedLecturesLength);
=======
        if (typeof selectedLecturesLength === "undefined") {
            selectedLecturesLength = JSON.parse(Settings.getSetting("selectedLectures") || "[]").length;
            Settings.setSetting("selectedLecturesLength", selectedLecturesLength);
>>>>>>> feat-grades
            return selectedLecturesLength;
        } else {
            return parseInt(selectedLecturesLength);
        }
    };

    return {
        lectures: lectures,
        lecturesForUser: lecturesForUser,
<<<<<<< HEAD
=======
        lecturesThisWeek: lecturesThisWeek,
>>>>>>> feat-grades
        fromCache: fromCache,
        getAllLectureTitles: getAllLectureTitles,
        secondsSinceCache: secondsSinceCache,
        getCurrentLecture: getCurrentLecture,
        getNextLecture: getNextLecture,
        getSelectedLecturesLength: getSelectedLecturesLength
    };
});
