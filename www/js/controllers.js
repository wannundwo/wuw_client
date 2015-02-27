angular.module('wuw.controllers', [])

.controller('DeadlinesCtrl', function($scope, Deadlines) {
    $scope.deadlines = Deadlines.all();
    console.log($scope.deadlines)
})

.controller('DeadlineDetailCtrl', function($scope, $stateParams, Deadlines) {
    $scope.deadline = Deadlines.get($stateParams.deadlineId);
})

.controller('CreateDeadlineCtrl', function($scope, Deadlines, $timeout) {
    $scope.savingIcon = '<i class="icon ion-android-done"></i>';
    $scope.deadline = {};

    $scope.save = function() {
        $scope.savingIcon = '<i class="icon spin ion-load-b"></i>';
        $timeout(function() {
            $scope.savingIcon = '<i class="icon ion-android-cloud-done"></i>';
        }, 3000);

    }
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
