import './templateSample.directive.scss';
import template from './templateSample.directive.html';

class TemplateSampleDirectiveController {
    constructor($scope, $element, videoGeneration) {
        this.videoGeneration = videoGeneration;
        this.$element = $element;

        $scope.$watch('vm.isReady', (value) => {
            if (!value) return;
            if (this.isReady){
                this.videoGeneration.takeScreenshot(this.$element, true);
                this.isReady = !this.isReady;
            }
        });
    }
}

export const templateSampleDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateSampleDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            isReady: '=',
            image: '=',
        },
    };
};

TemplateSampleDirectiveController.$inject = ['$scope', '$element', 'videoGeneration'];
