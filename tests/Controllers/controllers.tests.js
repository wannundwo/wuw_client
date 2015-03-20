'use strict';

describe('Controllers', function(){
    var scope, ionicLoadingMock, lecturesMock;

    // load the controller's module
    beforeEach(module('wuw.controllers', function($provide) {
      $provide.value('Lectures', lecturesMock);
    }));

    beforeEach(inject(function($rootScope, $controller) {
        ionicLoadingMock = jasmine.createSpyObj('ionicLoading', ['show']);
        scope = $rootScope.$new();
        $controller('HomeCtrl', {
          $scope: scope,
          $ionicLoading: ionicLoadingMock

        });
    }));

    // actual tests
    it('should have doRefresh() method', function(){
        //expect(scope.settings.enableFriends).toEqual(true);
        expect(typeof scope.doRefresh).toBe("function");
    });
});
