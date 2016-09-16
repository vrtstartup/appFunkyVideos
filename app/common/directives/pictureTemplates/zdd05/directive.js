import './style.scss';
import template from './template.html';

class zdd05Controller {
    constructor($sce) {}
}

export const zdd05Directive = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: zdd05Controller,
        controllerAs: 'vm',
        bindToController: {
            text: '=',
            imageOne: '=',
            imageTwo: '=',
            imageThree: '=',
            imageFour: '=',
            imageFive: '=',
            templateClass: '=',
            imageSizeOne: '=',
            imageSizeTwo: '=',
            imageSizeThree: '=',
            imageSizeFour: '=',
            imageSizeFive: '=',
            date: '=',

        },
    };
};

zdd05Controller.$inject = ['$sce'];