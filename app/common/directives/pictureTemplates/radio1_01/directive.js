import './style.scss';
import template from './template.html';

class radio1_01Controller {
    constructor($sce) {}
}

export const radio1_01Directive = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: radio1_01Controller,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            name: '=',
            image: '=',
            templateClass: '=',
            imageSize: '=',
        },
    };
};

radio1_01Controller.$inject = ['$sce'];