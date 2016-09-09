import './style.scss';
import template from './template.html';

class drd01Controller {
    constructor($sce) {
    }
}

export const drd01Directive = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: drd01Controller,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            image: '=',
            templateClass: '=',
        },
    };
};

drd01Controller.$inject = ['$sce'];
