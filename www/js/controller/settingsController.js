'use strict';

angular.module('wuw.controllers')

/*
 * The settings controller.
 */
.controller('SettingsCtrl', function($scope, Settings) {
    $scope.settings = {};
    $scope.settings.version = Settings.getSetting('version');
    $scope.settings.apiUrl = Settings.getSetting('apiUrl');
    $scope.settings.course  = Settings.getSetting('course');

    $scope.save = function() {
        Settings.setSetting('apiUrl', $scope.settings.apiUrl);
    };

    $scope.openLink = function(url) {
        if (url) {
            window.open(url, '_system', 'location=yes');

            // if(url.substring(0, 6) === 'mailto') {
            //     window.location.href = url;
            // } else {
            //     window.open(url, '_system', 'location=yes');
            // }
        }
    };
});
