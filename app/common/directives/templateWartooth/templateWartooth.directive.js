import './templateWartooth.directive.scss';
import template from './templateWartooth.directive.html';

class TemplateWartoothDirectiveController {
    constructor($scope, $element, videoGeneration) {
        this.videoGeneration = videoGeneration;
        this.$element = $element;

        console.log('templateWartooth', this.isReady);
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
            isReady: '=',
            textOne: '=',
            imgOne: '=',
            imgTwo: '=',
            textTwo: '=',
            textThree: '=',
            imgThree: '=',
            footerText: '=',
        },
    };
};

TemplateWartoothDirectiveController.$inject = ['$scope', '$element', 'videoGeneration'];
