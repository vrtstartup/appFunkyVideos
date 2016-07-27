import './templateStampington.directive.scss';
import template from './templateStampington.directive.html';

class TemplateStampingtonDirectiveController {
    constructor() {

    }
}

export const templateStampingtonDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateStampingtonDirectiveController,
        controllerAs: 'vm',
        bindToController: {

            image: '=',
            templateClass: '=',
            imageSize: '=',
        },
    };
};

TemplateStampingtonDirectiveController.$inject = [];
