import './style.scss';
import template from './template.html';

class zdd04Controller {
    constructor($sce) {}
}

export const zdd04Directive = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: zdd04Controller,
        controllerAs: 'vm',
        bindToController: {
            text: '=',
            imageOne: '=',
            imageTwo: '=',
            imageThree: '=',
            imageFour: '=',
            templateClass: '=',
            imageSizeOne: '=',
            imageSizeTwo: '=',
            imageSizeThree: '=',
            imageSizeFour: '=',
            date: '=',

        },
    };
};

zdd04Controller.$inject = ['$sce'];