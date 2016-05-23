import './templateBob.directive.scss';
import template from './templateBob.directive.html';

class TemplateBobDirectiveController {
    constructor() {

    }
}

export const templateBobDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateBobDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            image: '=',
            templateClass: '=',
        },
    };
};

TemplateBobDirectiveController.$inject = [];
