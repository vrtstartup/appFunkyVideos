import './templateFinn.directive.scss';
import template from './templateFinn.directive.html';

class TemplateFinnDirectiveController {
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

export const templateFinnDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateFinnDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            isReady: '=',
            image: '=',
            authorName: '=',
            //authorTitle: '=',
        },
    };
};

TemplateFinnDirectiveController.$inject = ['$scope', '$element', 'videoGeneration'];
