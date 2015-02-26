angular.module('wuw.services', [])

.factory('Deadlines', function() {

    var deadlines = [
        {id: 0, title: "Mathe AB1", content: "text"},
        {id: 1, title: "Mathe AB2", content: "text"},
        {id: 2, title: "Mathe AB3", content: "text"},
        {id: 3, title: "Mathe AB4", content: "text"}
    ];

    return {
        all: function() {
            return deadlines;
        },
        get: function(id) {
            return deadlines[id];
        },
        add: function(newDeadline) {

        }
    }
})

// super simple service to store the users settings
// before every key, we add the 'wuw_' prefix
.service('Settings', function($window) {
  return {
    setSetting: function(key, value) {
      $window.localStorage['wuw_'+key] = value;
    },
    getSetting: function(key) {
      return $window.localStorage['wuw_'+key];
    }
  }
})
