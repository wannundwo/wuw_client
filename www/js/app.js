"use strict";

angular.module('wuw', ['ionic', 'wuw.controllers', 'wuw.services', 'wuw.directives', 'wuw.filters', 'angular.filter', 'pascalprecht.translate', 'wuw.czErrorMessage', 'wuw.czErrorMessage', 'wuw.czWeekView', 'ngIOS9UIWebViewPatch'])

.run(function($ionicPlatform, $state, $rootScope, Settings, Users) {

    var apiUrl = "https://app.hft-stuttgart.de:4342/api/v0";
    var versionNumber = "0.6.6";

    // predefined settings
    Settings.setSetting('version', versionNumber);
    Settings.setSetting('apiUrl', apiUrl);
    Settings.setSetting('cacheDeadline', 300);
    Settings.setSetting('cacheLectures', 300);
    Settings.setSetting('cacheMensa', 86400);

    $ionicPlatform.ready(function() {

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        if (window.StatusBar && window.StatusBarManager) {
            if (ionic.Platform.isIOS()) {
                // iOS specific settings
            } else if (ionic.Platform.isAndroid()) {
                // Android specific settings
                StatusBar.backgroundColorByHexString("#8F4823");
            }

        }

        if (window.cordova && typeof Settings.getSetting('uuid') === "undefined") {
            Settings.setSetting('uuid', device.uuid);
        }

        // ping home
        Users.ping();
    });
})

.config(function($stateProvider, $urlRouterProvider, $translateProvider, $ionicConfigProvider) {

    // enable native scrolling on Android
    if (ionic.Platform.isAndroid()) {
        $ionicConfigProvider.scrolling.jsScrolling(false);
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.tabs.style('standard');
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
    .state('tab.deadline-create', {
        url: '/createDeadline',
        views: {
            'tab-deadlines': {
            templateUrl: 'templates/tab-deadline-create.html',
            controller: 'DeadlinesCreateCtrl'
        }
      }
    })

    .state('tab.lecturesList', {
        url: '/lecturesList',
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
        url: '/setup?showBackButton',
        views: {
            'view-setup': {
                templateUrl: 'templates/setup.html',
                controller: 'SetupCtrl'
            }
        }
    })
    .state('setupDetail', {
        url: '/setupDetail/:group',
        views: {
            'view-setup': {
                templateUrl: 'templates/setup-detail.html',
                controller: 'SetupDetailCtrl'
            }
        }
    })

    .state('tab.news', {
        url: '/news',
        views: {
            'tab-news': {
                templateUrl: 'templates/news.html',
                controller: 'NewsCtrl'
            }
        }
    })

    .state('tab.events', {
        url: '/events',
        views: {
            'tab-events': {
                templateUrl: 'templates/events.html',
                controller: 'EventsCtrl'
            }
        }
    })

    .state('tab.printers', {
        url: '/printers',
        views: {
            'tab-printers': {
                templateUrl: 'templates/printers.html',
                controller: 'PrintersCtrl'
            }
        }
    })

    .state('tab.freeRooms', {
        url: '/freeRooms',
        views: {
            'tab-freeRooms': {
                templateUrl: 'templates/freeRooms.html',
                controller: 'FreeRoomsCtrl'
            }
        }
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
