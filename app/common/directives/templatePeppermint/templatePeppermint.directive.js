import './templatePeppermint.directive.scss';
import template from './templatePeppermint.directive.html';

class TemplatePeppermintDirectiveController {
    constructor() {

    }
}

export const templatePeppermintDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplatePeppermintDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            image: '=',
            authorName: '=',
            authorDates: '=',
            imageSize: '=',
        },
    };
};

TemplatePeppermintDirectiveController.$inject = [];
