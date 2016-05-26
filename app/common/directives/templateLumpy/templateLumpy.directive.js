import './templateLumpy.directive.scss';
import template from './templateLumpy.directive.html';

class TemplateLumpyDirectiveController {
    constructor() {


    }

}

export const templateLumpyDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateLumpyDirectiveController,
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

TemplateLumpyDirectiveController.$inject = [];
