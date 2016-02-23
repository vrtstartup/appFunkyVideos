import './templateMurderface.directive.scss';
import template from './templateMurderface.directive.html';

class TemplateMurderfaceDirectiveController {
    constructor() {


        console.log('templateMurderface');

    }
}

export const templateMurderfaceDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateMurderfaceDirectiveController,
        controllerAs: 'vm',
        bindToController: {},
        transclude: true,
    };
};

TemplateMurderfaceDirectiveController.$inject = [];
