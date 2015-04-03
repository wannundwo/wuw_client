"use strict";

angular.module('wuw', ['ionic', 'wuw.controllers', 'wuw.services', 'wuw.filters', 'angular.filter', 'pascalprecht.translate'])

.run(function($ionicPlatform, Settings) {

    // predefined settings
    Settings.setSetting('version', 'v0.1.0');
    if (typeof Settings.getSetting('apiUrl') === 'undefined') {
        Settings.setSetting('apiUrl', 'http://wuw.benleb.de:8088/api/v0');
    }
    if (typeof Settings.getSetting('course') === 'undefined') {
        Settings.setSetting('course', 'IF');
    }
    if (typeof Settings.getSetting('uuid') === "undefined") {
        // we simply use the current milli seconds as uuid
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

.config(function($stateProvider, $urlRouterProvider, $translateProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js

    $stateProvider
    // setup an abstract state for the tabs directive
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
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

    .state('tab.lectures', {
        url: '/lectures',
        views: {
            'tab-lectures': {
            templateUrl: 'templates/tab-lectures.html',
            controller: 'LecturesCtrl'
        }
      }
    })
    .state('tab.lectures-detail', {
        url: '/lectures/:lectureId',
        views: {
            'tab-lectures': {
            templateUrl: 'templates/tab-lectures-detail.html',
            controller: 'LecturesDetailCtrl'
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
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/home');

    // load translation
    $translateProvider.useStaticFilesLoader({
        prefix: 'lang/locale-',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('de_DE');
    $translateProvider.fallbackLanguage('en_US');
});
