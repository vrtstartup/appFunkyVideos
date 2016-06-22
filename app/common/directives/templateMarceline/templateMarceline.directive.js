import './templateMarceline.directive.scss';
import template from './templateMarceline.directive.html';

class TemplateMarcelineDirectiveController {
    constructor() {

    }
}

export const templateMarcelineDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateMarcelineDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            image: '=',
            authorName: '=',
            authorDates: '=',
            imageSize: '=',
        },
    };
};

TemplateMarcelineDirectiveController.$inject = [];
