import './templatePickels.directive.scss';
import template from './templatePickels.directive.html';

class TemplatePickelsDirectiveController {
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

export const templatePickelsDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplatePickelsDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            isReady: '=',
            image: '=',
            templateClass: '=',
            numbr: '=',
        },
    };
};

TemplatePickelsDirectiveController.$inject = ['$scope', '$element', 'videoGeneration'];
