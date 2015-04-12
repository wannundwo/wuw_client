
    'use strict';

    angular.module('wuw.czErrorMessage', [])

    .controller('czErrorMessageCtrl', ['$scope', '$ionicSlideBoxDelegate', '$timeout', function($scope, $ionicSlideBoxDelegate, $timeout) {

        var el;

        this.init = function(element) {
            el = angular.element(element);
            $scope.hide(); // the error message is hidden by default
        };

        $scope.hide = function() {
            el.removeClass("czMessageBox-rolldown");
            el.addClass("czMessageBox-rollup");
            $scope.visible = false;
        };

        $scope.show = function() {
            $ionicSlideBoxDelegate.slide(1,10);
            el.removeClass("czMessageBox-rollup");
            el.addClass("czMessageBox-rolldown");
        };

        $scope.$on('czErrorMessage.show', function(event, args) {
            $scope.show();
        });

        $scope.$on('czErrorMessage.hide', function(event, args) {
            $scope.hide();
        });

        $scope.slideHasChanged = function($index) {
            if ($index !== 1) {
                $scope.hide();
            }
        };
    }])

    .directive('czErrorMessage', function () {
        return {
            restrict: 'E',
            controller: 'czErrorMessageCtrl',
            template:
                        '<ion-slide-box class="czMessageBox czMessageBox-rollup" show-pager="false" on-slide-changed="slideHasChanged($index)">' +
                            '<ion-slide>' +
                                '<br>' +
                            '</ion-slide>' +
                            '<ion-slide>' +
                                '<ion-scroll direction="x" scrollbar-x="false">'+
                                    '<ng-transclude></ng-transclude>'+
                                '</ion-scroll>'+
                            '</ion-slide>'+
                            '<ion-slide>'+
                                '<br>'+
                            '</ion-slide>'+
                        '</ion-slide-box>',
            transclude: true,
            scope: {
            },
            link: function(scope, element, attrs, czErrorMessageCtrl) {
                czErrorMessageCtrl.init(element[0].children[0]);
            }
        };
    });
