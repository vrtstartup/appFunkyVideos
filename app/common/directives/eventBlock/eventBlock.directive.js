import template from './eventBlock.directive.html';

class EventBlockDirectiveController {
    constructor($scope) {
        console.log('EventBlock');
    }
}

export const eventBlockDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: EventBlockDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            text: '=',
            image: '=',
        },
    };
};

EventBlockDirectiveController.$inject = ['$scope'];
