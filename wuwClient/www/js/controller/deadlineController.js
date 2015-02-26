angular.module('wuw.controllers')

.controller('DeadlinesCtrl', function($scope, Deadlines) {
    console.log("hello");
    Deadlines.all().then(function(deadlines){
        $scope.deadlines = deadlines;
    });
})

.controller('DeadlineDetailCtrl', function($scope, $stateParams, Deadlines) {
    $scope.deadline = Deadlines.get($stateParams.deadlineId);
})

.controller('CreateDeadlineCtrl', function($scope, Deadlines, $timeout, Settings, $http) {
    $scope.savingIcon = '<i class="icon ion-android-done"></i>';
    $scope.savingText = 'Save Deadline';
    $scope.deadline = {};

    $scope.save = function() {
        $scope.savingIcon = '<i class="icon spin ion-load-b"></i>';
        $scope.savingText = 'saving...';

        console.log(JSON.stringify($scope.deadline));
        Deadlines.add($scope.deadline).then(function(res){
            // success
            $scope.savingIcon = '<i class="icon ion-android-cloud-done"></i>';
            $scope.savingText = 'Deadline saved!';
        }, function(res){
            // failure
        });
    }
})
