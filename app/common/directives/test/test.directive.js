// USAGE: <div id="progress" vrt-test is-hidden="vm.isHidden"></div>


import template from './test.directive.html';

class TestDirectiveController {
    constructor($scope, $log, $element, $http, videoGeneration) {
        this.$log = $log;
        this.$http = $http;
        this.$element = $element;
        this.$scope = $scope;
        this.videoGeneration = videoGeneration;


        $scope.$watch('vm.isHidden', (value) => {
            if (value) {
                TweenMax.to(this.$element, 10, {width:496, onUpdate: this.videoGeneration.takeScreenshot, onUpdateParams: [this.$element]});
            } else {
                TweenMax.to(this.$element, 1, {width:0});
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
    };
};

TestDirectiveController.$inject = ['$scope', '$log', '$element', '$http', 'videoGeneration'];
