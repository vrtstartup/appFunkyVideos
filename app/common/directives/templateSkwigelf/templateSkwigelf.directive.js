import './templateSkwigelf.directive.scss';
import template from './templateSkwigelf.directive.html';

class TemplateSkwigelfDirectiveController {
    constructor() {


    }
}

export const templateSkwigelfDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateSkwigelfDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            image: '=',
            authorName: '=',
            authorTitle: '=',
            isMirrored: '=',
        },
    };
};

TemplateSkwigelfDirectiveController.$inject = [];
