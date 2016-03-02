import './templateMurderface.directive.scss';
import template from './templateMurderface.directive.html';

class TemplateMurderfaceDirectiveController {
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

export const templateMurderfaceDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateMurderfaceDirectiveController,
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

TemplateMurderfaceDirectiveController.$inject = ['$scope', '$element', 'videoGeneration'];
