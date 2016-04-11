import './templateExplosion.directive.scss';
import template from './templateExplosion.directive.html';

class TemplateExplosionDirectiveController {
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

export const templateExplosionDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateExplosionDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            headline: '=',
            isReady: '=',
            image: '=',
            templateClass: '=',
        },
    };
};

TemplateExplosionDirectiveController.$inject = ['$scope', '$element', 'videoGeneration'];
