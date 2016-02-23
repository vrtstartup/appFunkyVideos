import './templateMurderface.directive.scss';
import template from './templateMurderface.directive.html';

class TemplateMurderfaceDirectiveController {
    constructor($scope, $element, videoGeneration) {
        this.videoGeneration = videoGeneration;
        this.$element = $element;

        console.log('templateMurderface', this.isReady);
        $scope.$watch('vm.isReady', (value) => {
            if (!value) return;
            //console.log('templateMurderface here comes', this.quote);

            if (this.isReady){
                console.log('Take screenshot, it is ready!', this.$element);
                this.videoGeneration.takeScreenshot(this.$element);
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
        },
        transclude: true,
    };
};

TemplateMurderfaceDirectiveController.$inject = ['$scope', '$element', 'videoGeneration'];
