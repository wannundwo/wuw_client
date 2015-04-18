"use strict";

angular.module('wuw.controllers')

.controller('SetupCtrl', function($scope, $timeout, $ionicLoading, Groups) {
    console.log("setup says hello");

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> <br> Loading available Lectures...'
    });

    Groups.loadAllGroupsWithLectures().then(function(groups) {
        // make this data useable for ngModel
        for (var i = 0; i < groups.length; i++) {
            groups[i].allChosen = false;
            for(var j = 0; j < groups[i].lectures.length; j++) {
                var lectureName = groups[i].lectures[j];
                groups[i].lectures[j] = {};
                groups[i].lectures[j].lectureName = lectureName;
                groups[i].lectures[j].chosen = false;
            }
        }
        $scope.groups = groups;
    }, function() {
        // TODO: error handling
    }).finally(function() {
        $ionicLoading.hide();
    });

    $scope.onTouch = function($event) {
        var el = angular.element($event.target);
        el.addClass("item-actived-background-transition-active");

        $timeout(function() {
            el.removeClass("item-actived-background-transition-active");
        }, 200);
    };

    $scope.onRelease = function($event) {
        var el = angular.element($event.target);
        //
    };



    $scope.toggleGroup = function(group) {
        console.log(group);
        if (group.shown) {
            group.shown = false;
        } else {
            group.shown = true;
        }
    };

    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };

    /*
        lecture: the clicked lecture
        checked: true if the checkbox is checked
        group: the group to which this lecture belongs
    */
    $scope.lectureChecked = function(lecture, checked) {
        console.log(lecture, checked);
    };

    /*
        group: the clicked group
        checked: true if the checkbox is checked
    */
    $scope.groupChecked = function(group, checked) {
        console.log(group, checked);
    };

});
