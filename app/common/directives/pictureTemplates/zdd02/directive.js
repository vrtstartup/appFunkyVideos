import './style.scss';
import template from './template.html';

class zdd02Controller {
    constructor($sce) {}
}

export const zdd02Directive = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: zdd02Controller,
        controllerAs: 'vm',
        bindToController: {
            text: '=',
            imageOne: '=',
            imageTwo: '=',
            templateClass: '=',
            imageSizeOne: '=',
            imageSizeTwo: '=',
            date: '=',
            vs: '=',

        },
    };
};

zdd02Controller.$inject = ['$sce'];