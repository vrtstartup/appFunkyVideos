import './templatePickels.directive.scss';
import template from './templatePickels.directive.html';

class TemplatePickelsDirectiveController {
    constructor() {

    }
}

export const templatePickelsDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplatePickelsDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            image: '=',
            templateClass: '=',
            numbr: '=',
        },
    };
};

TemplatePickelsDirectiveController.$inject = [];
