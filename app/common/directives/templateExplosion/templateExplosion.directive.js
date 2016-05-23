import './templateExplosion.directive.scss';
import template from './templateExplosion.directive.html';

class TemplateExplosionDirectiveController {
    constructor() {

    }
}

export const templateExplosionDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateExplosionDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            headline: '=',
            image: '=',
            templateClass: '=',
        },
    };
};

TemplateExplosionDirectiveController.$inject = [];
