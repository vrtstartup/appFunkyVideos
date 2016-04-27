import './templateJake.directive.scss';
import template from './templateJake.directive.html';

class TemplateJakeDirectiveController {
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

export const templateJakeDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateJakeDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            isReady: '=',
            image: '=',
        },
    };
};

TemplateJakeDirectiveController.$inject = ['$scope', '$element', 'videoGeneration'];
