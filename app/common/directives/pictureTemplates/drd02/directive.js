import './style.scss';
import template from './template.html';

class drd02Controller {
    constructor($sce) {}
}

export const drd02Directive = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: drd02Controller,
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

drd02Controller.$inject = ['$sce'];