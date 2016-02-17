import './text.directive.scss';
import template from './text.directive.html';

class TextDirectiveController {
    constructor($scope, $log, $element, $http, videoGeneration) {
        this.$log = $log;
        this.$http = $http;
        this.$element = $element;
        this.$scope = $scope;
        this.videoGeneration = videoGeneration;


        $scope.$watch('vm.isAnimated', (value) => {

            let target = this.$element.find('div');
            console.log('DATA TEXT', target);

            if (value) {
                TweenMax.to(target, 10, {width:496});
            } else {
                TweenMax.to(target, 1, {width:0});
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

TextDirectiveController.$inject = ['$scope', '$log', '$element', '$http', 'videoGeneration'];
