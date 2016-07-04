/*jshint bitwise: false*/
'use strict';

angular.module('wuw.services')

.factory('Lectures', function($http, $q, Settings) {
    var lectures = JSON.parse(Settings.getSetting('lecturesCache') || '[]');
    // var lecturesWeekly = JSON.parse(Settings.getSetting('lecturesWeeklyCache') || '[]');

    /*
     * Return lectures of the current user for the use in the lectures-listview
     */
    var lecturesForUser = function(weekly) {
        var deferred = $q.defer();
        var selectedLectures = JSON.parse(Settings.getSetting('selectedLectures') || '[]');

        // if the user hasn't selected courses, reject the request
        if (selectedLectures.length === 0) {
            lectures = [];
            Settings.setSetting('lecturesCache', '[]');
            deferred.reject('noLecturesSelected');
            return deferred.promise;
        }

        $http.get(Settings.getSetting('apiUrl') + '/lectures/users/' + Settings.getSetting('uuid') + "/?weekly=" + weekly)
        .success(function(data, status, headers, config) {

            // add datefield to every lecutre (useable for grouping)
            for (var i = 0; i < data.length; i++) {
                var d = new Date(data[i].startTime).setHours(0);
                data[i].date = new Date(d).setMinutes(0);
            }


            if (weekly) {
                Settings.setSetting('lecturesWeeklyCache', JSON.stringify(data));
                Settings.setSetting('lecturesWeeklyCacheTime', new Date().getTime());
            } else {
                Settings.setSetting('lecturesCache', JSON.stringify(data));
                Settings.setSetting('lecturesCacheTime', new Date().getTime());
            }

            lectures = data;
            deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
            deferred.reject('httpFailed');
        });
        return deferred.promise;
    };

    /*
     * Returns lectures from cache.
     * If weekly is true we provide data for easy use in calendar.
    */
    var fromCache = function(weekly) {
        var cached;
        if (weekly) {
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
    var secondsSinceCache = function(weekly) {
        var cacheTime;
        if (weekly) {
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
        return JSON.parse(Settings.getSetting('selectedLectures'));
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
        var nextLectureDistance = Number.MAX_SAFE_INTEGER;
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
        if (typeof selectedLecturesLength === 'undefined') {
            selectedLecturesLength = JSON.parse(Settings.getSetting('selectedLectures') || '[]').length;
            Settings.setSetting('selectedLecturesLength', selectedLecturesLength);
            return selectedLecturesLength;
        } else {
            return parseInt(selectedLecturesLength);
        }
    };

    return {
        lectures: lectures,
        lecturesForUser: lecturesForUser,
        fromCache: fromCache,
        getAllLectureTitles: getAllLectureTitles,
        secondsSinceCache: secondsSinceCache,
        getCurrentLecture: getCurrentLecture,
        getNextLecture: getNextLecture,
        getSelectedLecturesLength: getSelectedLecturesLength
    };
});
