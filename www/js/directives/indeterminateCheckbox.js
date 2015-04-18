"use strict";

angular.module('wuw.directives', [])

/**
 * Directive for an indeterminate (tri-state) checkbox.
 * Based on the examples at http://stackoverflow.com/questions/12648466/how-can-i-get-angular-js-checkboxes-with-select-unselect-all-functionality-and-i
 */
.directive('indeterminateCheckbox', [function() {
    return {
        scope: true,
        require: '?ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            var childList = attrs.childList;
            var property = attrs.property;

            // Bind the click event to update children
            element.bind('click', function() {
                scope.$apply(function () {
                    var isChecked = element.prop('checked');

                    // Set each child's selected property to the checkbox's checked property
                    angular.forEach(scope.$eval(childList), function(child) {
                        child[property] = isChecked;
                    });
                });
            });

            // Watch the children for changes
            scope.$watch(childList, function(newValue) {
                var hasChecked = false;
                var hasUnchecked = false;

                // Loop through the children
                angular.forEach(newValue, function(child) {
                    if (child[property]) {
                        hasChecked = true;
                    } else {
                        hasUnchecked = true;
                    }
                });

                // Determine which state to put the checkbox in
                if (hasChecked && hasUnchecked) {
                    element.prop('checked', false);
                    element.prop('indeterminate', true);
                    if (modelCtrl) {
                        modelCtrl.$setViewValue(false);
                    }
                } else {
                    element.prop('checked', hasChecked);
                    element.prop('indeterminate', false);
                    if (modelCtrl) {
                        modelCtrl.$setViewValue(hasChecked);
                    }
                }
            }, true);
        }
    };
}]);
