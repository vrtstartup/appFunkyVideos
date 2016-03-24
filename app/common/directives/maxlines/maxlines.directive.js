// TODO: refactor from link to controller
class maxlinesDirectiveController {
    constructor($scope, $log, $element) {

    }

}

export const maxlinesDirective = function() {
    return {
        restrict: 'A',
        require: '?ngModel',
        scope: {},
        controller: maxlinesDirectiveController,
        controllerAs: 'vm',
        bindToController: {},
        link: (scope, elem, attrs, ngModel) => {

            var maxLines = 1;
            attrs.$observe('vrtMaxlines', (val) => {
                maxLines = parseInt(val);
            });
            ngModel.$validators.maxlines = function(modelValue, viewValue) {
                var numLines = (modelValue || '').split("\n").length;
                return numLines <= maxLines;
            };
            attrs.$observe('maxlinesPreventEnter', function(preventEnter) {
                // if attribute value starts with 'f', treat as false. Everything else is true
                preventEnter = (preventEnter || '').toLocaleLowerCase().indexOf('f') !== 0;
                if (preventEnter) {
                    addKeypress();
                } else {
                    removeKeypress();
                }
            });

            function addKeypress() {
                elem.on('keypress', function(event) {
                    // test if adding a newline would cause the validator to fail
                    if (event.keyCode == 13 && !ngModel.$validators.maxlines(ngModel.$modelValue + '\n', ngModel.$viewValue + '\n')) {
                        event.preventDefault();
                    }
                });
            }

            function removeKeypress() {
                elem.off('.maxlines');
            }

            scope.$on('$destroy', removeKeypress);
        },
    };
};

maxlinesDirectiveController.$inject = ['$scope', '$log', '$element'];
