import template from './test.directive.html';

class TestDirectiveController {
    constructor($scope, $log) {
        this.$log = $log;
        $log.info('ctrl TestDirectiveController');
    }

    doClick() {
        this.$log.info('click');
    }
}

export const testDirective = function() {
    return {
        restrict: 'EA',
        template: template,
        scope: {},
        controller: TestDirectiveController,
        controllerAs: 'vm',
        // more info: http://blog.thoughtram.io/angularjs/2015/01/02/exploring-angular-1.3-bindToController.html
        bindToController: {
            title: '@',
            click: '&',
        },
    };
};

TestDirectiveController.$inject = ['$scope', '$log'];
