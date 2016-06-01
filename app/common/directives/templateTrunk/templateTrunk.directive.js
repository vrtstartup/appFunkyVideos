import './templateTrunk.directive.scss';
import template from './templateTrunk.directive.html';

class TemplateTrunkDirectiveController {
    constructor() {


    }
}

export const templateTrunkDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateTrunkDirectiveController,
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

TemplateTrunkDirectiveController.$inject = [];
