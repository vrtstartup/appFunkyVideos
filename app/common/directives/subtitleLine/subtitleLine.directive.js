import template from './subtitleLine.directive.html';

class subtitleLineDirectiveController {
    constructor($scope, $log, $element, videogular) {
        this.$log = $log;
        this.$element = $element;
        this.$scope = $scope;
        this.videogular = videogular;
        const that = this;
        this.slider = {
            options: {
                id: this.key,
                floor: 0,
                ceil: this.videogular.api.totalTime / 1000,
                step: 0.001,
                precision: 10,
                draggableRange: true,
                noSwitching: true,
                onChange: function changeSlider(sliderId, modelValue, highValue){that.$scope.$emit('sliderChanged', sliderId, modelValue, highValue);}
            }
        };
    }

}



export const subtitleLineDirective = function() {
    return {
        restrict: 'AE',
        template: template,
        scope: {},
        controller: subtitleLineDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            key: '=',
            in : '=',
            out: '=',
            text: '='
        },
    };
};

subtitleLineDirectiveController.$inject = ['$scope', '$log', '$element', 'videogular'];
