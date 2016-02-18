import template from './screenshot.directive.html';

class ScreenshotDirectiveController {
    constructor($scope, $log, $element, $http, videoGeneration) {
        this.$log = $log;
        this.$http = $http;
        this.$element = $element;
        this.$scope = $scope;
        this.videoGeneration = videoGeneration;


        $scope.$watch('vm.isAnimated', (value) => {
            let target = this.$element.find('section');
            if (value) {
                TweenMax.to(target, 8, {color: '#fff', onUpdate: this.videoGeneration.takeScreenshot, onUpdateParams: [target]});
            } else {
                TweenMax.to(this.$element, 1, {opacity: 1});
            }
        }, true);
    }
}

export const screenshotDirective = function() {
    return {
        restrict: 'EA',
        template: template,
        scope: {},
        controller: ScreenshotDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            isAnimated: '=',
        },
    };
};

ScreenshotDirectiveController.$inject = ['$scope', '$log', '$element', '$http', 'videoGeneration'];
