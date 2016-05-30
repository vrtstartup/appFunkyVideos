import './templateBubblegum.directive.scss';
import template from './templateBubblegum.directive.html';

class TemplateBubblegumDirectiveController {
    constructor() {

    }
}

export const templateBubblegumDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateBubblegumDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            image: '=',
            imageSize: '=',
        },
    };
};

TemplateBubblegumDirectiveController.$inject = [];
