"use strict";

angular.module("wuw.controllers")

.controller("LecturesWeeklyCtrl", function($scope, $locale, $ionicHistory, $translate, $ionicPopover, $state, $ionicPopup, Lectures, Settings) {
    
    $scope.events = [];

    /*
     * Navigates to the list view of the lectures and remembers this,
     * so when the user opens the lectures tab again, he will automatically
     * see the last choosen type of view.
     */
    $scope.switchToList = function() {
        Settings.setSetting("lecturesView", "lecturesList");
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $state.go("tab.lecturesList", {location: "replace"});
    };

    $scope.events = [
            [
                {
                    title: "M1",
                    startTime: moment.utc("2016-05-02T08:20:00+1000", moment.ISO_8601).toDate(),
                    endTime: moment.utc("2016-05-02T09:00:00+1000", moment.ISO_8601).toDate()
                },
                {
                    title: "M1",
                    startTime: moment.utc("2016-05-02T10:00:00+1000", moment.ISO_8601).toDate(),
                    endTime: moment.utc("2016-05-02T11:00:00+1000", moment.ISO_8601).toDate()
                }
            ],
            [
                {
                    title: "A1",
                    startTime: moment.utc("2016-05-03T08:30:00+1000", moment.ISO_8601).toDate(),
                    endTime: moment.utc("2016-05-03T11:30:00+1000", moment.ISO_8601).toDate()
                },
                {
                    title: "A1",
                    startTime: moment.utc("2016-05-03T12:00:00+1000", moment.ISO_8601).toDate(),
                    endTime: moment.utc("2016-05-03T15:30:00+1000", moment.ISO_8601).toDate()
                },
                {
                    title: "A2",
                    startTime: moment.utc("2016-05-03T12:30:00+1000", moment.ISO_8601).toDate(),
                    endTime: moment.utc("2016-05-03T14:00:00+1000", moment.ISO_8601).toDate()
                },
                {
                    title: "A3",
                    startTime: moment.utc("2016-05-03T13:30:00+1000", moment.ISO_8601).toDate(),
                    endTime: moment.utc("2016-05-03T18:30:00+1000", moment.ISO_8601).toDate()
                }
            ],
            [
                {
                    title: "B1",
                    startTime: moment.utc("2016-05-04T14:30:00+1000", moment.ISO_8601).toDate(),
                    endTime: moment.utc("2016-05-04T16:00:00+1000", moment.ISO_8601).toDate()
                },
                {
                    title: "B2",
                    startTime: moment.utc("2016-05-04T16:00:00+1000", moment.ISO_8601).toDate(),
                    endTime: moment.utc("2016-05-04T17:00:00+1000", moment.ISO_8601).toDate()
                }
            ],
            [
                {
                    title: "DO1",
                    startTime: moment.utc("2016-05-05T10:00:00+1000", moment.ISO_8601).toDate(),
                    endTime: moment.utc("2016-05-05T11:00:00+1000", moment.ISO_8601).toDate()
                }
            ],
            [
                {
                    title: "F1",
                    startTime: moment.utc("2016-05-06T10:00:00+1000", moment.ISO_8601).toDate(),
                    endTime: moment.utc("2016-05-06T11:00:00+1000", moment.ISO_8601).toDate()
                },
                {
                    title: "A1",
                    startTime: moment.utc("2016-05-06T12:00:00+1000", moment.ISO_8601).toDate(),
                    endTime: moment.utc("2016-05-06T13:10:00+1000", moment.ISO_8601).toDate()
                },
                {
                    title: "A2",
                    startTime: moment.utc("2016-05-06T12:30:00+1000", moment.ISO_8601).toDate(),
                    endTime: moment.utc("2016-05-06T14:00:00+1000", moment.ISO_8601).toDate()
                }
            ]
        ];


     
});
