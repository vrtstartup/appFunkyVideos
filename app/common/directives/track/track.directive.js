import template from './track.directive.html';

class TrackDirectiveController {
    constructor($scope, $log, $element) {
        this.$log = $log;
        this.$element = $element;
        this.$scope = $scope;

        this.$log.info('Track dir controller')
    }
}

export const trackDirective = function() {
    return {
        restrict: 'AE',
        template: template,
        scope: {},
        controller: TrackDirectiveController,
        controllerAs: 'vm',
        bindToController: {},
    };
};

TrackDirectiveController.$inject = ['$scope', '$log', '$element'];
