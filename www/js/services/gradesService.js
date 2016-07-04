/*jshint bitwise: false*/

"use strict";

angular.module("wuw.services")

.factory("Grades", function($http, $q, Settings) {
    var dishes = JSON.parse(Settings.getSetting('dishesCache') || '[]');
    var numberOfDishes = 18;

    var parseXML = function(xml) {
        var dom = null;
        if (window.DOMParser) {
            try { dom = (new DOMParser()).parseFromString(xml, "text/xml"); }
            catch (e) { dom = null; }
        }
        return dom;
    };

    var getGrades = function(username, password) {
        var deferred = $q.defer();

        $http({
            url: 'https://php.rz.hft-stuttgart.de/hftapp/notenhftapp.php',
            method: "POST",
            headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'},
            data: "username=" + username + "&password=" + password
        })
        .then(function(response) {
            if(response.status === 200) {
                var dom = parseXML(response.data), json = xml2json(dom);
                deferred.resolve(json);
            } else {
                deferred.reject(response);
            }
        },
        function(response) {
            deferred.reject(response);
        });

        return deferred.promise;
    };

    return {
        getGrades: getGrades
    };
});
