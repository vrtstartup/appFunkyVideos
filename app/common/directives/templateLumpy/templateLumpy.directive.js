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
            imageOne: '=',
            imageTwo: '=',
            imageThree: '=',
            authorNameOne: '=',
            authorNameTwo: '=',
            authorNameThree: '=',
            titleOne: '=',
            titleTwo: '=',
            titleThree: '=',
        },
    };
};

TemplateLumpyDirectiveController.$inject = [];
