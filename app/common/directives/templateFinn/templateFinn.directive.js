import './templateFinn.directive.scss';
import template from './templateFinn.directive.html';

class TemplateFinnDirectiveController {
    constructor() {

    }
}

export const templateFinnDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateFinnDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            image: '=',
            authorName: '=',
            //authorTitle: '=',
        },
    };
};

TemplateFinnDirectiveController.$inject = [];
