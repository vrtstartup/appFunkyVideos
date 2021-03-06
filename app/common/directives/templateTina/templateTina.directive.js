import './templateTina.directive.scss';
import template from './templateTina.directive.html';

class TemplateTinaDirectiveController {
    constructor() {


    }
}

export const templateTinaDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateTinaDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            image: '=',
            authorName: '=',
            authorTitle: '=',
            imageSize: '=',
        },
    };
};

TemplateTinaDirectiveController.$inject = [];
