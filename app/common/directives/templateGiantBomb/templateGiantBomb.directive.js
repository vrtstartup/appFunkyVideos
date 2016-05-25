import './templateGiantBomb.directive.scss';
import template from './templateGiantBomb.directive.html';

class TemplateGiantBombDirectiveController {
    constructor() {

    }
}

export const templateGiantBombDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateGiantBombDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            image: '=',
            templateClass: '=',
            numbr: '=',
            line1: '=',
            line2: '=',
            size: '='
        },
    };
};

TemplateGiantBombDirectiveController.$inject = [];