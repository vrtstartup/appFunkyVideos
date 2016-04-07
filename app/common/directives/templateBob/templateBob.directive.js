import './templateBob.directive.scss';
import template from './templateBob.directive.html';

class TemplateBobDirectiveController {
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

export const templateBobDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateBobDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            isReady: '=',
            image: '=',
            templateClass: '=',
        },
    };
};

TemplateBobDirectiveController.$inject = ['$scope', '$element', 'videoGeneration'];
