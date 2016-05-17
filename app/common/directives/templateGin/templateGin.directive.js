import './templateGin.directive.scss';
import template from './templateGin.directive.html';

class TemplateGinDirectiveController {
    constructor() {

    }
}

export const templateGinDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateGinDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            image: '=',
            authorNameOne: '=',
            authorNameTwo: '=',
            authorNameThree: '=',
            authorNameFour: '=',
            titleOne: '=',
            titleTwo: '=',
            titleThree: '=',
            titleFour: '=',
            imageOne: '=',
            imageTwo: '=',
            imageThree: '=',
            imageFour: '=',
        },
    };
};

TemplateGinDirectiveController.$inject = [];
