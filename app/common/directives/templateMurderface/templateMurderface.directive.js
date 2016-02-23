import './templateMurderface.directive.scss';
import template from './templateMurderface.directive.html';

class TemplateMurderfaceDirectiveController {
    constructor($scope, $element, videoGeneration) {
        this.videoGeneration = videoGeneration;
        this.$element = $element;

        console.log('templateMurderface', this.isReady);
        $scope.$watch('vm.isReady', (value) => {
            if (!value) return;
            let target = this.$element.find('section');
            if (this.isReady){
                console.log('Element', target );
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
            image: '=',
        },
    };
};

TemplateMurderfaceDirectiveController.$inject = ['$scope', '$element', 'videoGeneration'];
