import './style.scss';
import template from './template.html';

class zdd01Controller {
    constructor($sce) {}
}

export const zdd01Directive = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: zdd01Controller,
        controllerAs: 'vm',
        bindToController: {
            text: '=',
            label: '=',
            image: '=',
            templateClass: '=',
            imageSize: '=',
            date: '=',
            firstname: '=',
            lastname: '='
        },
    };
};

zdd01Controller.$inject = ['$sce'];