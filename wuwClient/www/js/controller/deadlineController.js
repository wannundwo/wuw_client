angular.module('wuw.controllers')

.controller('DeadlinesCtrl', function($scope, Deadlines) {
    $scope.deadlines = Deadlines.all();
    console.log($scope.deadlines)
})

.controller('DeadlineDetailCtrl', function($scope, $stateParams, Deadlines) {
    $scope.deadline = Deadlines.get($stateParams.deadlineId);
})

.controller('CreateDeadlineCtrl', function($scope, Deadlines, $timeout, Settings, $http) {
    $scope.savingIcon = '<i class="icon ion-android-done"></i>';
    $scope.deadline = {};

    $scope.save = function() {
        $scope.savingIcon = '<i class="icon spin ion-load-b"></i>';
        var req = {
            method: 'POST',
            url: 'http://example.com',
            headers: {
                'Content-Type': undefined
            },
            data: { test: 'test' },
        };
        
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        $http({
            url: "http://localhost:8088/api/v0/deadlines",
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: { 'info' : "info", 'deadline' : 'deadline' }
        })
        .then(function(response) {
            console.log(response);
        }, 
        function(response) { // optional
            console.log("failed" + JSON.stringify(response));
        });
        
       
        // $scope.savingIcon = '<i class="icon ion-android-cloud-done"></i>';
        

    }
})