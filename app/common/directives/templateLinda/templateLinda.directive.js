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

        $scope.$watchCollection('[vm.titleOne, vm.titleTwo, vm.titleThree, vm.titleFour, ' +
            'vm.authorNameOne, vm.authorNameTwo, vm.authorNameThree, vm.authorNameFour]', (value) => {
            if(!value) return;

            this.setLineWidth();
        });

    }

    setLineWidth() {
        this.width = 0;
        let results = this.$element[0].getElementsByClassName('auth-title');
        angular.forEach(results, (title) => {
            this.width = title.offsetWidth > this.width ? title.offsetWidth : this.width;
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
