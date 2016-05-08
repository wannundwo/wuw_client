"use strict";

angular.module("wuw.controllers")


/*
 * The mensa controller.
 */
.controller("GradesCtrl", function($scope, $ionicPopup, $timeout, $filter, Grades, Dishes, Settings) {

    var moreCounter = 0;
    $scope.infoVisible = false;

    $scope.get = function() {

        var grades = Grades.getGrades().then(function(grades){
            var rawGrades = JSON.parse(grades).ex.es;

            $scope.grades = [];

            rawGrades.forEach(function(e, idx, arr) {

                // filter "grundstudium" entry
                if(Number(e.e.nummer) === 2998) { return; }

                // show passed status if no grade is available
                var gradePassed = (e.e.note !== null) ? (e.e.note/100).toFixed(1) : e.e.bestanden;

                // format season
                var season;
                if(Number(e.e.semester.charAt(4)) === 1) {
                    season = "SS" + e.e.semester.substring(2,4);
                } else if(Number(e.e.semester.charAt(4)) === 2) {
                    season = "WS" + e.e.semester.substring(2,4) + "/" + (Number(e.e.semester.substring(2,4))+1);
                } else {
                    season = e.e.semester;
                }

                var g = {
                    id: e.e.nummer,
                    ects: e.e.bonus,
                    date: e.e.datum,
                    grade: gradePassed,
                    season: season,
                    passed: e.e.bestanden,
                    name: e.e.text,
                    attempt: e.e.versuch
                };
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
        $scope.get();
    });

    // $scope.$on('$ionicView.afterEnter', function(){
    //     // If the cache is older then 'cacheMensa' seconds, load new data from API.
    //     if (Dishes.secondsSinceCache() > Settings.getSetting('cacheMensa')) {
    //         $scope.loadDishes();
    //     }
    // });
});
