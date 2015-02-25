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
        }
    }
})
