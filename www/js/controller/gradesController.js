"use strict";

angular.module("wuw.controllers")


/*
 * The mensa controller.
 */
.controller("GradesCtrl", function($scope, $ionicPopup, $timeout, $filter, Grades, Settings) {

    //$scope.infoVisible = false;

    $scope.creds = {};
    $scope.grades = [];
    $scope.loading = false;

    $scope.get = function() {

        $scope.loading = true;

        var grades = Grades.getGrades($scope.creds.username, $scope.creds.password).then(function(grades){

            var rawGrades = JSON.parse(grades).ex.es;
            $scope.grades = [];
            $scope.loading = false;

            rawGrades.forEach(function(e, idx, arr) {

                // filter "grundstudium" entry
                if(Number(e.e.nummer) === 2998) { return; }

                // show passed status if no grade is available
                var gradePassed = (e.e.note !== null) ? (e.e.note/100).toFixed(1) : e.e.bestanden;

                // format season
                var season;
                if(Number(e.e.semester.charAt(4)) === 1) {
                    season = "Sommersemester " + e.e.semester.substring(0,4);
                } else if(Number(e.e.semester.charAt(4)) === 2) {
                    season = "Wintersemester " + e.e.semester.substring(0,4) + "/" + (Number(e.e.semester.substring(0,4))+1);
                } else {
                    season = e.e.semester;
                }

                // build entry
                var g = {
                    id: e.e.nummer,
                    ects: Number(e.e.bonus).toFixed(0),
                    date: e.e.datum,
                    grade: gradePassed,
                    season: season,
                    passed: e.e.bestanden,
                    name: e.e.text,
                    attempt: e.e.versuch
                };

                // push to array
                $scope.grades.push(g);
            });

            $scope.$broadcast("czErrorMessage.hide"); //hide an eventually shown error message
        }, function() {
            // show the error message with some delay to prevent flickering
            $timeout(function() {
                $scope.$broadcast("czErrorMessage.show");
            }, 300);
        }).finally(function () {
            // remove the refresh spinner a little bit later to prevent flickering
            $timeout(function() {
                $scope.$broadcast("scroll.refreshComplete");
            }, 400);
        });

    };

    $scope.$on('$ionicView.loaded', function(){
        //$scope.get();
    });

    // $scope.$on('$ionicView.afterEnter', function(){
    //     // If the cache is older then 'cacheMensa' seconds, load new data from API.
    //     if (Dishes.secondsSinceCache() > Settings.getSetting('cacheMensa')) {
    //         $scope.loadDishes();
    //     }
    // });
});
