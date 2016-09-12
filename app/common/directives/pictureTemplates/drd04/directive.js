import './style.scss';
import template from './template.html';

class drd04Controller {
    constructor($sce) {}
}

export const drd04Directive = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: drd04Controller,
        controllerAs: 'vm',
        bindToController: {
            text: '=',
            label: '=',
            image: '=',
            templateClass: '=',
            imageSize: '=',
        },
    };
};

drd04Controller.$inject = ['$sce'];