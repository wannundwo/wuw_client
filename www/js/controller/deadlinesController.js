angular.module('wuw.controllers')

.controller('DeadlinesCtrl', function($scope, Deadlines, Settings) {
    $scope.loadDeadlines = function() {
        Deadlines.all().then(function(deadlines){
            $scope.deadlines = deadlines;
        }).finally(function () {
            $scope.$broadcast('scroll.refreshComplete');
        })
    };

    $scope.doRefresh = function() {
        $scope.loadDeadlines()
    };

    // load deadlines from cache
    var localDeadlinesString = Settings.getSetting('localDeadlines');
    if (typeof localDeadlinesString == 'undefined') {
        // no local deadlines, go and get them!
        $scope.doRefresh();
    } else {
        $scope.deadlines = JSON.parse(localDeadlinesString || '[]');
    }


})

.controller('DeadlinesDetailCtrl', function($scope, $stateParams, $state, Deadlines) {
    $scope.deadline = Deadlines.get($stateParams.deadlineId);
    $scope.saveDeadline = function() {
        Deadlines.save($scope.deadline);
        setTimeout(function() {
            $state.go("tab.deadlines", {location: "replace"});
        }, 750);
    }
})

.controller('DeadlinesCreateCtrl', function($scope, $state, Deadlines, Settings) {
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
            setTimeout(function() {
                $state.go("tab.deadlines", {location: "replace"});
            }, 750);
        }, function(res){
            // failure
        });
    }
})
