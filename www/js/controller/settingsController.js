angular.module('wuw.controllers')

.controller('SettingsCtrl', function($scope, Settings) {
    $scope.settings = {};
    $scope.settings.apiUrl = Settings.getSetting('apiUrl');
    $scope.settings.course  = Settings.getSetting('course');

    $scope.save = function() {
        Settings.setSetting('apiUrl', $scope.settings.apiUrl);
    }

});
