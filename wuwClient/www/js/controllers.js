angular.module('wuw.controllers', [])

.controller('DeadlinesCtrl', function($scope, Deadlines) {
    $scope.deadlines = Deadlines.all();
})

.controller('DeadlineDetailCtrl', function($scope, $stateParams, Deadlines) {
    $scope.deadline = Deadlines.get($stateParams.deadlineId);
})

.controller('HomeCtrl', function($scope) {
})

.controller('OptionsCtrl', function($scope) {
});
