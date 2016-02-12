// app.directive("hideMe", function ($animate) {
//     return function(scope, element, attrs) {
//         scope.$watch(attrs.hideMe, function(newVal) {
//             if (newVal) {
//                 $animate.addClass(element, "fade");
//             } else {
//                 $animate.removeClass(element, "fade");
//             }
//         });
//     };
// });

import template from './test.directive.html';

class TestDirectiveController {
    constructor($scope, $log, $animate, $element) {
        this.$log = $log;
        $log.info('ctrl TestDirectiveController', this.isHidden);

        $scope.$watch('vm.isHidden', (value) => {
            if (value) {
                $log.info('New val:', $element);
                $animate.addClass($element, "fade");
            } else {
                $log.info('New val:', value);

                $animate.removeClass($element, "fade");
            }
        }, true);

    }
}

export const testDirective = function() {
    return {
        restrict: 'A',
        template: template,
        scope: {},
        controller: TestDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            isHidden: '=',
        },
        // link: (scope, element, attrs) => {
        //     console.log('ATTRS', attrs);
        // },
    };
};

TestDirectiveController.$inject = ['$scope', '$log', '$animate', '$element'];
