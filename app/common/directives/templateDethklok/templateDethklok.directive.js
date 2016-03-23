import './templateDethklok.directive.scss';
import template from './templateDethklok.directive.html';

class TemplateDethklokDirectiveController {
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

export const templateDethklokDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateDethklokDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            isReady: '=',
            image: '=',
            templateClass: '=',
            footerText: '=',
        },
    };
};

TemplateDethklokDirectiveController.$inject = ['$scope', '$element', 'videoGeneration'];
