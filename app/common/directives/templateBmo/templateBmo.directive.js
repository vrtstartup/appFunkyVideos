import './templateBmo.directive.scss';
import template from './templateBmo.directive.html';

class TemplateBmoDirectiveController {
    constructor() {

    }
}

export const templateBmoDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateBmoDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            image: '=',
            templateClass: '=',
            header: '=',
            quote: '=',
            imageSize: '=',
        },
    };
};

TemplateBmoDirectiveController.$inject = [];