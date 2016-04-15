import './templateLinda.directive.scss';
import template from './templateLinda.directive.html';

class TemplateLindaDirectiveController {
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

export const templateLindaDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateLindaDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            isReady: '=',
            image: '=',
            authorNameOne: '=',
            authorNameTwo: '=',
            authorNameThree: '=',
            authorNameFour: '=',
            titleOne: '=',
            titleTwo: '=',
            titleThree: '=',
            titleFour: '=',
        },
    };
};

TemplateLindaDirectiveController.$inject = ['$scope', '$element', 'videoGeneration'];
