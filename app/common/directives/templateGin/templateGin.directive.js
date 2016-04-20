import './templateGin.directive.scss';
import template from './templateGin.directive.html';

class TemplateGinDirectiveController {
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

export const templateGinDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateGinDirectiveController,
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
            imageOne: '=',
            imageTwo: '=',
            imageThree: '=',
            imageFour: '=',
        },
    };
};

TemplateGinDirectiveController.$inject = ['$scope', '$element', 'videoGeneration'];
