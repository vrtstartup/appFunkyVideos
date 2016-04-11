import './templateTina.directive.scss';
import template from './templateTina.directive.html';

class TemplateTinaDirectiveController {
    constructor($scope, $element, videoGeneration, $document) {
        this.videoGeneration = videoGeneration;
        this.$element = $element;
        this.$document = $document;

        $scope.$watch('vm.isReady', (value) => {
            if (!value) return;
            if (this.isReady){
                this.videoGeneration.takeScreenshot(this.$element, true);
                this.isReady = !this.isReady;
            }
        });

        $scope.$watch('vm.image', (value) => {
            if (!value) return;

            console.log('vm.image', this.image);
        });


    }
}

export const templateTinaDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateTinaDirectiveController,
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

TemplateTinaDirectiveController.$inject = ['$scope', '$element', 'videoGeneration', '$document'];
