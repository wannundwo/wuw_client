"use strict";

angular.module('wuw', ['ionic', 'wuw.controllers', 'wuw.services', 'wuw.directives', 'wuw.filters', 'angular.filter', 'pascalprecht.translate', 'wuw.czErrorMessage', 'ui.calendar'])

.run(function($ionicPlatform, $state, $rootScope, Settings) {

    var apiUrl = "https://wuw.benleb.de:4342/api/v0";
    var versionNumber = "0.3.0";

    // predefined settings
    Settings.setSetting('version', versionNumber);
    Settings.setSetting('apiUrl', apiUrl);


    if (typeof Settings.getSetting('uuid') === "undefined") {
        // We currently use, for simplity, just a timestamp as uuid.
        // TODO: Use real uuid.
        Settings.setSetting('uuid', new Date().getTime());
    }

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $translateProvider, $ionicConfigProvider) {

    // enable native scrolling on Android
    if (ionic.Platform.isAndroid()) {
        $ionicConfigProvider.scrolling.jsScrolling(false);
    }

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js

    var otherwise = "/tab/home";
    if (typeof window.localStorage.wuw_selectedGroups === "undefined") {
        otherwise = "/setup";
    }

    $stateProvider
    // setup an abstract state for the tabs directive
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html",
        controller: function($scope, Settings) {
            $scope.lecturesUrl = Settings.getSetting("lecturesView") || "lecturesWeekly";
            console.log($scope.lecturesUrl);
        }
    })

    // Each tab has its own nav history stack:
    .state('tab.home', {
        url: '/home',
        views: {
            'tab-home': {
            templateUrl: 'templates/tab-home.html',
            controller: 'HomeCtrl'
        }
      }
    })

    .state('tab.deadlines', {
        url: '/deadlines',
        views: {
            'tab-deadlines': {
            templateUrl: 'templates/tab-deadlines.html',
            controller: 'DeadlinesCtrl'
        }
      }
    })
    .state('tab.deadline-detail', {
        url: '/deadlines/:deadlineId',
        views: {
            'tab-deadlines': {
            templateUrl: 'templates/tab-deadline-detail.html',
            controller: 'DeadlinesDetailCtrl'
        }
      }
    })
    .state('tab.deadline-create', {
        url: '/createDeadline',
        views: {
            'tab-deadlines': {
            templateUrl: 'templates/tab-create-deadline.html',
            controller: 'DeadlinesCreateCtrl'
        }
      }
    })

    .state('tab.lecturesList', {
        url: '/lectures',
        views: {
            'tab-lectures': {
            templateUrl: 'templates/tab-lectures-list.html',
            controller: 'LecturesListCtrl'
        }
      }
    })
    
    .state('tab.lecturesWeekly', {
        url: '/lecturesWeekly',
        views: {
            'tab-lectures': {
            templateUrl: 'templates/tab-lectures-weekly.html',
            controller: 'LecturesWeeklyCtrl'
        }
      }
    })

    .state('tab.mensa', {
        url: '/mensa',
        views: {
            'tab-mensa': {
            templateUrl: 'templates/tab-mensa.html',
            controller: 'MensaCtrl'
        }
      }
    })

    .state('tab.settings', {
        url: '/settings',
        views: {
            'tab-settings': {
            templateUrl: 'templates/tab-settings.html',
            controller: 'SettingsCtrl'
        }
      }
    })

    .state('setup', {
        url: '/setup',
        templateUrl: 'templates/setup.html',
        controller: 'SetupCtrl'
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise(otherwise);

    // load translation
    $translateProvider.useStaticFilesLoader({
        prefix: 'lang/locale-',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('de_DE');
    $translateProvider.fallbackLanguage('en_US');
});
