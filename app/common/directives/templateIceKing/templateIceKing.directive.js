import './templateIceKing.directive.scss';
import template from './templateIceKing.directive.html';

class TemplateIceKingDirectiveController {
    constructor() {

    }
}

export const templateIceKingDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateIceKingDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            image: '=',
            imageSize: '=',
            city: '=',
            weatherImageSrc: '=',
        },
    };
};

TemplateIceKingDirectiveController.$inject = [];
