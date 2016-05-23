import './templateMurderface.directive.scss';
import template from './templateMurderface.directive.html';

class TemplateMurderfaceDirectiveController {
    constructor() {

    }
}

export const templateMurderfaceDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateMurderfaceDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            image: '=',
            authorName: '=',
            authorTitle: '=',
            isHiddenSign: '=',
        },
    };
};

TemplateMurderfaceDirectiveController.$inject = [];
