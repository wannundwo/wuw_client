angular.module('wuw.controllers', [])

.controller('DeadlinesCtrl', function($scope, Deadlines) {
    $scope.deadlines = Deadlines.all();
})

.controller('DeadlineDetailCtrl', function($scope, $stateParams, Deadlines) {
    $scope.deadline = Deadlines.get($stateParams.deadlineId);
})

.controller('CreateDeadlineCtrl', function($scope, Deadlines) {
})

.controller('HomeCtrl', function($scope) {
})

.controller('HomeCtrl', function($scope) {
})

.controller('SettingsCtrl', function($scope, Settings) {
    $scope.settings = {};
    $scope.settings.apiUrl = Settings.getSetting('apiUrl');

    $scope.save = function() {
        Settings.setSetting('apiUrl', $scope.settings.apiUrl);
    }

});
