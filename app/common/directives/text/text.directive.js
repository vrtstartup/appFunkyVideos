import './text.directive.scss';
import template from './text.directive.html';

class TextDirectiveController {
    constructor($scope, $log, $element, $http, videoGeneration, $document) {
        this.$log = $log;
        this.$http = $http;
        this.$element = $element;
        this.$scope = $scope;
        this.videoGeneration = videoGeneration;



        $scope.$watch('vm.isAnimated', (value) => {
            let target = this.$element.find('span');
            if (value) {
                this.text = this.percValue + '%'+ ' ' +  this.titleText;
                TweenMax.to(target, 5, {height: 0});
            } else {
            }
        }, true);
    }
}

export const textDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TextDirectiveController,
        controllerAs: 'vm',
        transclude: true,
        bindToController: {
            isAnimated: '=',
            titleText: '=',
            percValue: '=',
        },
    };
};

TextDirectiveController.$inject = ['$scope', '$log', '$element', '$http', 'videoGeneration', '$document'];
