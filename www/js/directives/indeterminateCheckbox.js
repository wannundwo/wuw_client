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
            attrs.$observe('state', function(newValue){
                if (attrs.state === "indeterminate") {
                    element.prop('checked', false);
                    element.prop('indeterminate', true);
                } else if (attrs.state === "checked") {
                    element.prop('checked', true);
                    element.prop('indeterminate', false);
                } else {
                    element.prop('checked', false);
                    element.prop('indeterminate', false);
                }
            });
        }
    };
}]);
