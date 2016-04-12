import './templateWartooth.directive.scss';
import template from './templateWartooth.directive.html';

class TemplateWartoothDirectiveController {
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

export const templateWartoothDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateWartoothDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            isReady: '=',
            image: '=',
            authorName: '=',
            authorTitle: '=',
            isHiddenSign: '=',
        },
    };
};

TemplateWartoothDirectiveController.$inject = ['$scope', '$element', 'videoGeneration'];
