import './templateCinnabon.directive.scss';
import template from './templateCinnabon.directive.html';

class TemplateCinnabonDirectiveController {
    constructor() {

    }
}

export const templateCinnabonDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateCinnabonDirectiveController,
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

TemplateCinnabonDirectiveController.$inject = [];
