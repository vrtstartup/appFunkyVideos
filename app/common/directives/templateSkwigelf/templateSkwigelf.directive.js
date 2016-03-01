import './templateSkwigelf.directive.scss';
import template from './templateSkwigelf.directive.html';

class TemplateSkwigelfDirectiveController {
    constructor($scope, $element, videoGeneration) {
        this.videoGeneration = videoGeneration;
        this.$element = $element;

        $scope.$watch('vm.isReady', (value) => {
            if (!value) return;
            if (this.isReady){
                this.videoGeneration.takeScreenshot(this.$element, true);
            }
        });

    }
}

export const templateSkwigelfDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateSkwigelfDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            isReady: '=',
            image: '=',
            authorName: '=',
            authorTitle: '=',
            isMirrored: '=',
            isHiddenSign: '=',

        },
    };
};

TemplateSkwigelfDirectiveController.$inject = ['$scope', '$element', 'videoGeneration'];
