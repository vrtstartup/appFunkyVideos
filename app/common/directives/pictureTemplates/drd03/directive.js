import './style.scss';
import template from './template.html';

class drd03Controller {
    constructor($sce) {}
}

export const drd03Directive = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: drd03Controller,
        controllerAs: 'vm',
        bindToController: {
            text: '=',
            name: '=',
            function: '=',
            image: '=',
            templateClass: '=',
        },
    };
};

drd03Controller.$inject = ['$sce'];