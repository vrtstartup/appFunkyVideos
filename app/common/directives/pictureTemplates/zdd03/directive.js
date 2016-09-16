import './style.scss';
import template from './template.html';

class zdd03Controller {
    constructor($sce) {}
}

export const zdd03Directive = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: zdd03Controller,
        controllerAs: 'vm',
        bindToController: {
            text: '=',
            imageOne: '=',
            imageTwo: '=',
            imageThree: '=',
            templateClass: '=',
            imageSizeOne: '=',
            imageSizeTwo: '=',
            imageSizeThree: '=',
            date: '=',

        },
    };
};

zdd03Controller.$inject = ['$sce'];