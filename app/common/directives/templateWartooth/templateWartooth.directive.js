import './templateWartooth.directive.scss';
import template from './templateWartooth.directive.html';

class TemplateWartoothDirectiveController {
    constructor() {


    }
}

export const templateWartoothDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateWartoothDirectiveController,
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

TemplateWartoothDirectiveController.$inject = [];
