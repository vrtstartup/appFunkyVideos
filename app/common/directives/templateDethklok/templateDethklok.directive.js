import './templateDethklok.directive.scss';
import template from './templateDethklok.directive.html';

class TemplateDethklokDirectiveController {
    constructor() {

    }
}

export const templateDethklokDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateDethklokDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            image: '=',
            templateClass: '=',
            footerText: '=',
        },
    };
};

TemplateDethklokDirectiveController.$inject = [];
