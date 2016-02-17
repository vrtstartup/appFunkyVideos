import template from './text.directive.html';

class TextDirectiveController {
    constructor($scope, $log, $element, $http, videoGeneration) {
        this.$log = $log;
        this.$http = $http;
        this.$element = $element;
        this.$scope = $scope;
        this.videoGeneration = videoGeneration;


        $scope.$watch('vm.isHidden', (value) => {
            if (value) {
                TweenMax.to(this.$element, 10, {width:496, onUpdate: this.videoGeneration.takeScreenshot, onUpdateParams: [this.$element]});
            } else {
                TweenMax.to(this.$element, 1, {width:0});
            }
        }, true);
    }
}

export const textDirective = function() {
    return {
        restrict: 'A',
        template: template,
        scope: {},
        controller: TextDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            isHidden: '=',
        },
    };
};

TextDirectiveController.$inject = ['$scope', '$log', '$element', '$http', 'videoGeneration'];
