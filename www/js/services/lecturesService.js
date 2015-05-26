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
            Settings.setSetting('lecturesWeeklyCache', '[]');
            deferred.reject("noLecturesSelected");
            return deferred.promise;
        }

        $http.post(Settings.getSetting("apiUrl") + "/lectures/upcoming", {
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
            
            // add full-calendar specific properties
            var fcPreparedLectures = [];
            for (var j = 0; j < filteredLectures.length; j++) {
                var l = {
                    fciId: j,
                    title: filteredLectures[j].lectureName,
                    start: new Date(filteredLectures[j].startTime),
                    end: new Date(filteredLectures[j].endTime),
                    rooms: filteredLectures[j].rooms,
                    docents: filteredLectures[j].docents,
                    color: filteredLectures[j].color,
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
        var now = new Date().getTime();
        for (var i = 0; i < lectures.length; i++) {
            var start = new Date(lectures[i].startTime).getTime();
            var end   = new Date(lectures[i].endTime).getTime();
            if (start < now && now < end) {
                return lectures[i];
            }
        }
    };

    /*
        Returns the Users next Lecture.
    */
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
        lecturesForGroups: lecturesForGroups,
        lecturesThisWeek: lecturesThisWeek,
        fromCache: fromCache,
        getAllLectureTitles: getAllLectureTitles,
        secondsSinceCache: secondsSinceCache,
        getCurrentLecture: getCurrentLecture,
        getNextLecture: getNextLecture,
        getSelectedLecturesLength: getSelectedLecturesLength
    };
});
