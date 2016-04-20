import template from './eventBlock.directive.html';

class EventBlockDirectiveController {
    constructor() {

        console.log('EventBlockDirective');
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
            name: '=',
        },
    };
};

EventBlockDirectiveController.$inject = [];
