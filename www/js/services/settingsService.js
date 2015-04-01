"use strict";

angular.module('wuw.services')

// super simple service to store the users settings in local storage
// before every key, we add the 'wuw_' prefix
.service('Settings', function($window) {
  return {
    setSetting: function(key, value) {
        $window.localStorage['wuw_'+key] = value;
    },
    getSetting: function(key) {
        return $window.localStorage['wuw_'+key];
    }
  };
});
