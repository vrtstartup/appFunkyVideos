import './templateGiantBomb.directive.scss';
import template from './templateGiantBomb.directive.html';

class TemplateGiantBombDirectiveController {
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

export const templateGiantBombDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateGiantBombDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            isReady: '=',
            image: '=',
            templateClass: '=',
            numbr: '=',
            line1: '=',
            line2: '=',
            size: '='
        },
    };
};

TemplateGiantBombDirectiveController.$inject = ['$scope', '$element', 'videoGeneration'];
